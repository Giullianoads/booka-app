-- Criar tabela para perfis públicos
create table perfis (
  id uuid references auth.users on delete cascade not null primary key,
  atualizado_em timestamp with time zone,
  nome_completo text,
  email text,
  telefone text,
  tipo_usuario text check (tipo_usuario in ('cliente', 'prestador')),
  url_avatar text,

  constraint nome_completo_tamanho check (char_length(nome_completo) >= 3)
);

-- Criar tabela de clientes
create table clientes (
  id uuid references perfis(id) on delete cascade not null primary key,
  cpf text unique,
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar tabela de prestadores
create table prestadores (
  id uuid references perfis(id) on delete cascade not null primary key,
  cpf_cnpj text unique,
  nome_empresa text,
  horario_funcionamento text,
  biografia text,
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar tabela de servicos
create table servicos (
  id uuid default gen_random_uuid() primary key,
  prestador_id uuid references prestadores(id) on delete cascade not null,
  nome text not null,
  descricao text,
  preco decimal(10,2) not null,
  duracao_minutos integer not null,
  ativo boolean default true,
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar tabela de agendamentos
create table agendamentos (
  id uuid default gen_random_uuid() primary key,
  cliente_id uuid references clientes(id) on delete cascade not null,
  servico_id uuid references servicos(id) on delete cascade not null,
  data_agendamento timestamp with time zone not null,
  status text check (status in ('pendente', 'confirmado', 'cancelado', 'concluido')) default 'pendente',
  notas text,
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Configurar Row Level Security (RLS)
alter table perfis enable row level security;
alter table clientes enable row level security;
alter table prestadores enable row level security;
alter table servicos enable row level security;
alter table agendamentos enable row level security;

-- Políticas para perfis
create policy "Perfis públicos são visíveis por todos." on perfis
  for select using (true);

create policy "Usuários podem inserir seu próprio perfil." on perfis
  for insert with check (auth.uid() = id);

create policy "Usuários podem atualizar seu próprio perfil." on perfis
  for update using (auth.uid() = id);

-- Políticas para clientes
create policy "Clientes podem ver seus próprios dados." on clientes
  for select using (auth.uid() = id);

create policy "Clientes podem atualizar seus próprios dados." on clientes
  for update using (auth.uid() = id);

-- Políticas para prestadores
create policy "Prestadores são visíveis por todos." on prestadores
  for select using (true);

create policy "Prestadores podem atualizar seus próprios dados." on prestadores
  for update using (auth.uid() = id);

-- Políticas para servicos
create policy "Serviços são visíveis por todos." on servicos
  for select using (true);

create policy "Prestadores podem gerenciar seus próprios serviços." on servicos
  for all using (auth.uid() = prestador_id);

-- Políticas para agendamentos
create policy "Clientes podem ver seus próprios agendamentos." on agendamentos
  for select using (auth.uid() = cliente_id);

create policy "Prestadores podem ver agendamentos de seus serviços." on agendamentos
  for select using (
    exists (
      select 1 from servicos
      where servicos.id = agendamentos.servico_id
      and servicos.prestador_id = auth.uid()
    )
  );

create policy "Clientes podem criar agendamentos." on agendamentos
  for insert with check (auth.uid() = cliente_id);

-- Trigger para criar perfil no cadastro
create function public.lidar_com_novo_usuario()
returns trigger as $$
begin
  insert into public.perfis (id, nome_completo, email, tipo_usuario)
  values (new.id, new.raw_user_meta_data->>'nome_completo', new.email, new.raw_user_meta_data->>'tipo_usuario');
  return new;
end;
$$ language plpgsql security modeller;

create trigger ao_criar_usuario_auth
  after insert on auth.users
  for each row execute procedure public.lidar_com_novo_usuario();

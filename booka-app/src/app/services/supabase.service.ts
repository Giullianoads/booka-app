import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  get client() {
    return this.supabase;
  }

  async signUp(userData: any) {
    try {
      // 1. Cadastro no Auth do Supabase
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            nome_completo: userData.nome_completo,
            tipo_usuario: userData.tipo_usuario
          }
        }
      });

      if (authError) throw authError;

      // 2. Inserção na tabela específica baseada no tipo
      if (authData.user) {
        if (userData.tipo_usuario === 'cliente') {
          const { error: clientError } = await this.supabase
            .from('clientes')
            .insert([{ id: authData.user.id, cpf: userData.cpf }]);
          if (clientError) throw clientError;
        } else {
          const { error: providerError } = await this.supabase
            .from('prestadores')
            .insert([{ 
              id: authData.user.id, 
              cpf_cnpj: userData.cpf_cnpj,
              nome_empresa: userData.nome_empresa,
              horario_funcionamento: userData.horario_funcionamento
            }]);
          if (providerError) throw providerError;
        }
      }

      return { success: true, data: authData };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async testConnection() {
    try {
      const { data, error } = await this.supabase.from('perfis').select('count', { count: 'exact', head: true });
      if (error) throw error;
      return { success: true, message: 'Conectado com sucesso!' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
}

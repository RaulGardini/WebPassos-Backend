import UsuarioRepository from "../Repository/RepositoryUsuario";
import ColaboradorRepository from "../Repository/RepositoryColaborador";

class UsuarioService {
  static async getAllUsuarios() {
    return await UsuarioRepository.findAll();
  }
  
  static async validarLogin(login: string, senha: string) {
    if (!login || !senha) {
      return null;
    }
    
    const usuario = await UsuarioRepository.findByLogin(login.trim());
    
    if (!usuario || usuario.senha !== senha) {
      return null;
    }
    
    // Retorna usuário sem a senha
    return {
      id: usuario.id,
      login: usuario.login,
      nome: usuario.nome,
      tipo: usuario.tipo
    };
  }
    
  static async criarLoginColaborador(colaboradorId: number, senha: string, tipo: 'Professor' | 'Admin' = 'Professor') {
    // Busca o colaborador
    const colaborador = await ColaboradorRepository.findById(colaboradorId);
        
    if (!colaborador) {
      throw new Error("Colaborador não encontrado");
    }
    
    // Gera login baseado no nome (primeiro nome + sobrenome)
    const nomeCompleto = colaborador.nome.toLowerCase().trim();
    const partesNome = nomeCompleto.split(' ');
    let loginBase = '';
        
    if (partesNome.length === 1) {
      loginBase = partesNome[0];
    } else {
      loginBase = partesNome[0] + '.' + partesNome[partesNome.length - 1];
    }
        
    // Remove acentos e caracteres especiais
    loginBase = loginBase
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9.]/g, '');
    
    // Verifica se o login já existe e adiciona número se necessário
    let login = loginBase;
    let contador = 1;
        
    while (await UsuarioRepository.findByLogin(login)) {
      login = `${loginBase}${contador}`;
      contador++;
    }
    
    // Cria o usuário
    const novoUsuario = await UsuarioRepository.create({
      login,
      senha,
      nome: colaborador.nome, // Nome do colaborador
      tipo // Tipo definido (Professor ou Admin)
    });
    
    return {
      usuario: {
        id: novoUsuario.id,
        login: novoUsuario.login,
        nome: novoUsuario.nome,
        tipo: novoUsuario.tipo
      },
      colaborador: {
        id: colaborador.colaborador_id,
        nome: colaborador.nome,
        email: colaborador.email
      }
    };
  }
  
  static async atualizarUsuario(id: number, dados: { login?: string, senha?: string, nome?: string, tipo?: 'Professor' | 'Admin' }) {
    const usuario = await UsuarioRepository.findById(id);
        
    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }
    
    // Verifica se o novo login já existe (se está sendo alterado)
    if (dados.login && dados.login !== usuario.login) {
      const loginExistente = await UsuarioRepository.findByLogin(dados.login);
      if (loginExistente) {
        throw new Error("Login já existe");
      }
    }
    
    // Validar tipo se fornecido
    if (dados.tipo && !['Professor', 'Admin'].includes(dados.tipo)) {
      throw new Error("Tipo deve ser 'Professor' ou 'Admin'");
    }
    
    await UsuarioRepository.update(id, dados);
        
    return await UsuarioRepository.findById(id);
  }
  
  static async excluirUsuario(id: number) {
    const usuario = await UsuarioRepository.findById(id);
        
    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }
    
    await UsuarioRepository.delete(id);
    return { message: "Usuário excluído com sucesso" };
  }
  
  static async getColaboradoresSemLogin() {
    const todosColaboradores = await ColaboradorRepository.findAll();
    const todosUsuarios = await UsuarioRepository.findAll();
        
    // Filtra colaboradores que ainda não têm login
    const colaboradoresSemLogin = todosColaboradores.filter(colaborador => {
      return !todosUsuarios.some(usuario => usuario.nome === colaborador.nome);
    });
    
    return colaboradoresSemLogin;
  }
}

export default UsuarioService;
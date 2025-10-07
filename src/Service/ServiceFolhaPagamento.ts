import FolhaPagamentoRepository from "../Repository/RepositoryFolhaPagamento";
import { FolhaPagamentoFilter } from "../Filter/FolhaPagamento/FolhaPagamentoFilter";
import { ReadFolhaPagamentoDTO } from "../DTOs/FolhaPagamento/ReadFolhaPagamentoDTO";

class FolhaPagamentoService {
  static async getFolhaPagamento(filter: FolhaPagamentoFilter): Promise<ReadFolhaPagamentoDTO[]> {
    return await FolhaPagamentoRepository.getFolhaPagamento(filter);
  }
}

export default FolhaPagamentoService;
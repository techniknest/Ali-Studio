import { serviceRepository } from "@/repositories/service.repository";
import { NotFoundError } from "@/lib/errors/app-error";

export class ServiceService {
  async getServices(visibleOnly = false) {
    return serviceRepository.findAll(visibleOnly);
  }

  async createService(data: any) {
    const count = await serviceRepository.count();
    return serviceRepository.create({ ...data, order: count });
  }

  async updateService(id: string, data: any) {
    const item = await serviceRepository.update(id, data);
    if (!item) {
      throw new NotFoundError("Service");
    }
    return item;
  }

  async deleteService(id: string) {
    const success = await serviceRepository.delete(id);
    if (!success) {
      throw new NotFoundError("Service");
    }
    return true;
  }

  async reorderServices(ids: string[]) {
    await Promise.all(
      ids.map((id, index) => serviceRepository.update(id, { order: index }))
    );
    return true;
  }
}

export const serviceService = new ServiceService();

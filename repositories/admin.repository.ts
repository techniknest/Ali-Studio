import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";

export class AdminRepository {
  async findByEmail(email: string) {
    await connectDB();
    return Admin.findOne({ email });
  }

  async findByEmailExcludingId(email: string, excludeId: string) {
    await connectDB();
    return Admin.findOne({ email, _id: { $ne: excludeId } });
  }
}

export const adminRepository = new AdminRepository();

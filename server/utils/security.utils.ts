import * as crypto from "crypto";
import * as bcrypt from "bcryptjs";

export class SecurityUtils {
    // Legacy SHA256 - kept for migration support
    public static sha256(str: string): string {
        const hash = crypto.createHash("sha256");
        hash.update(str);
        return hash.digest("hex");
    }

    // New user registration - always use bcrypt
    public static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    // Login - try bcrypt first, fall back to SHA256 for migration
    public static async verifyPassword(
        password: string,
        hash: string
    ): Promise<{ valid: boolean; needsMigration: boolean }> {
        // If hash looks like bcrypt (starts with $2), use bcrypt compare
        if (hash.startsWith("$2")) {
            return { valid: await bcrypt.compare(password, hash), needsMigration: false };
        }
        // Otherwise, it's a legacy SHA256 hash - compare and flag for migration
        const sha256Hash = this.sha256(password);
        return { valid: sha256Hash === hash, needsMigration: true };
    }
}

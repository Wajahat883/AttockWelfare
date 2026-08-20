import { Router, Response } from "express";
import { AuthRequest, authenticate, ownerOnly } from "../middleware/auth.middleware";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../utils/password";

const router = Router();
const fields = { id: true, name: true, fatherName: true, address: true, phone: true, role: true, isActive: true, createdAt: true } as const;

router.get("/", authenticate, ownerOnly, async (_req: AuthRequest, res: Response): Promise<void> => {
  res.json({ success: true, data: await prisma.user.findMany({ where: { role: "ADMIN" }, select: fields, orderBy: { name: "asc" } }) });
});

router.post("/", authenticate, ownerOnly, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, phone, password, fatherName, address } = req.body;
  if (typeof name !== "string" || !name.trim() || typeof phone !== "string" || !phone.trim() || typeof password !== "string" || password.length < 8) { res.status(400).json({ error: "Bad Request", message: "Name, phone, and a password of at least 8 characters are required" }); return; }
  try { const admin = await prisma.user.create({ data: { name: name.trim(), phone: phone.trim(), fatherName: typeof fatherName === "string" ? fatherName.trim() : null, address: typeof address === "string" ? address.trim() : null, passwordHash: await hashPassword(password), role: "ADMIN" }, select: fields }); res.status(201).json({ success: true, data: admin }); }
  catch (error: unknown) { if (typeof error === "object" && error && "code" in error && error.code === "P2002") { res.status(409).json({ error: "Conflict", message: "A user with this phone number already exists" }); return; } res.status(500).json({ error: "Internal Server Error", message: "Failed to create admin" }); }
});

router.delete("/:id", authenticate, ownerOnly, async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id === req.user!.userId) { res.status(400).json({ error: "Bad Request", message: "Invalid admin ID" }); return; }
  const admin = await prisma.user.findFirst({ where: { id, role: "ADMIN" } });
  if (!admin) { res.status(404).json({ error: "Not Found", message: "Admin not found" }); return; }
  await prisma.user.update({ where: { id }, data: { isActive: false } });
  res.status(204).send();
});

export default router;

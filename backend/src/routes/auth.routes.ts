import { Router, Response } from "express";
import { AuthRequest, authenticate } from "../middleware/auth.middleware";
import { prisma } from "../lib/prisma";
import { comparePasswords } from "../utils/password";
import { generateToken } from "../utils/jwt";

const router = Router();

// POST /api/auth/login - User login
router.post("/login", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      res.status(400).json({
        error: "Bad Request",
        message: "Phone and password are required",
      });
      return;
    }

    // Find user by phone
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Invalid phone or password",
      });
      return;
    }

    // Compare passwords
    const isPasswordValid = await comparePasswords(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Invalid phone or password",
      });
      return;
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      role: user.role as "OWNER" | "ADMIN" | "USER",
      phone: user.phone,
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("[AUTH LOGIN ERROR]", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Login failed",
    });
  }
});

// POST /api/auth/me - Get current user info
router.get("/me", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        fatherName: true,
        address: true,
        monthlyAmount: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        error: "Not Found",
        message: "User not found",
      });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("[GET ME ERROR]", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to get user info",
    });
  }
});

export default router;

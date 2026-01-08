import { z } from 'zod';
import {
  PASSWORD_MIN_LENGTH,
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  WALLET_NAME_MAX_LENGTH,
} from '@/shared/constants/app';
import { SUPPORTED_CURRENCIES } from '@/shared/constants/currencies';

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(EMAIL_MAX_LENGTH, `Email must be less than ${EMAIL_MAX_LENGTH} characters`);

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const nameSchema = z
  .string()
  .max(NAME_MAX_LENGTH, `Name must be less than ${NAME_MAX_LENGTH} characters`)
  .optional();

export const currencySchema = z.enum(SUPPORTED_CURRENCIES as [string, ...string[]], {
  message: 'Invalid currency',
});

export const uuidSchema = z.string().uuid('Invalid ID format');

export const moneyAmountSchema = z
  .string()
  .min(1, 'Amount is required')
  .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'Amount must be a positive number',
  })
  .refine((val) => /^\d{1,18}(\.\d{1,4})?$/.test(val), {
    message: 'Invalid amount format (max 18 digits, 4 decimal places)',
  });

export const descriptionSchema = z
  .string()
  .max(DESCRIPTION_MAX_LENGTH, `Description must be less than ${DESCRIPTION_MAX_LENGTH} characters`)
  .optional();

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    firstName: nameSchema,
    lastName: nameSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export const updateProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
});

export const createWalletSchema = z.object({
  currency: currencySchema,
  name: z
    .string()
    .max(WALLET_NAME_MAX_LENGTH, `Name must be less than ${WALLET_NAME_MAX_LENGTH} characters`)
    .optional(),
});

export const renameWalletSchema = z.object({
  name: z
    .string()
    .min(1, 'Wallet name is required')
    .max(WALLET_NAME_MAX_LENGTH, `Name must be less than ${WALLET_NAME_MAX_LENGTH} characters`),
});

export const transferSchema = z
  .object({
    sourceWalletId: uuidSchema,
    targetWalletId: uuidSchema,
    amount: moneyAmountSchema,
    currency: currencySchema,
    description: descriptionSchema,
  })
  .refine((data) => data.sourceWalletId !== data.targetWalletId, {
    message: 'Cannot transfer to the same wallet',
    path: ['targetWalletId'],
  });

export const depositSchema = z.object({
  walletId: uuidSchema,
  amount: moneyAmountSchema,
  currency: currencySchema,
  description: descriptionSchema,
});

export const withdrawSchema = z.object({
  walletId: uuidSchema,
  amount: moneyAmountSchema,
  currency: currencySchema,
  description: descriptionSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateWalletInput = z.infer<typeof createWalletSchema>;
export type RenameWalletInput = z.infer<typeof renameWalletSchema>;
export type TransferInput = z.infer<typeof transferSchema>;
export type DepositInput = z.infer<typeof depositSchema>;
export type WithdrawInput = z.infer<typeof withdrawSchema>;
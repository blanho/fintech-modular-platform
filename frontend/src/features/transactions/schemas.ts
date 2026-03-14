import { z } from 'zod';

export const transferSchema = z
  .object({
    sourceWalletId: z.string().uuid('Invalid source wallet'),
    targetWalletId: z.string().uuid('Invalid target wallet'),
    amount: z
      .string()
      .min(1, 'Amount is required')
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: 'Amount must be a positive number',
      }),
    currency: z.string().length(3, 'Invalid currency code'),
    description: z.string().max(500, 'Description is too long').optional(),
  })
  .refine((data) => data.sourceWalletId !== data.targetWalletId, {
    message: 'Cannot transfer to the same wallet',
    path: ['targetWalletId'],
  });

export const depositSchema = z.object({
  walletId: z.string().uuid('Invalid wallet'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Amount must be a positive number',
    }),
  currency: z.string().length(3, 'Invalid currency code'),
  description: z.string().max(500, 'Description is too long').optional(),
});

export const withdrawSchema = z.object({
  walletId: z.string().uuid('Invalid wallet'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Amount must be a positive number',
    }),
  currency: z.string().length(3, 'Invalid currency code'),
  description: z.string().max(500, 'Description is too long').optional(),
});

export type TransferInput = z.infer<typeof transferSchema>;
export type DepositInput = z.infer<typeof depositSchema>;
export type WithdrawInput = z.infer<typeof withdrawSchema>;
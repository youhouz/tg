import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caracteres'),
  firstName: z.string().min(2, 'Prenom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  phone: z.string().optional(),
  accountType: z.enum(['PARTICULIER', 'PROFESSIONNEL']),
  companyName: z.string().optional(),
  siret: z.string().optional(),
  tvaNumber: z.string().optional(),
  newsletter: z.boolean().default(false),
  rgpdConsent: z.boolean().refine((val) => val === true, {
    message: 'Vous devez accepter la politique de confidentialite',
  }),
});

export const addressSchema = z.object({
  label: z.string().default('Domicile'),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  street: z.string().min(5),
  complement: z.string().optional(),
  zipCode: z.string().regex(/^\d{5}$/, 'Code postal invalide'),
  city: z.string().min(2),
  country: z.string().default('France'),
  isDefault: z.boolean().default(false),
});

export const checkoutSchema = z.object({
  addressId: z.string().min(1, 'Adresse de livraison requise'),
  deliveryMode: z.enum(['DOMICILE', 'POINT_RELAIS', 'CLICK_COLLECT']),
  deliveryNotes: z.string().optional(),
  promoCode: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
});

export const promoCodeSchema = z.object({
  code: z.string().min(3),
  type: z.enum(['POURCENTAGE', 'MONTANT_FIXE', 'LIVRAISON_GRATUITE']),
  value: z.number().positive(),
  minOrderAmount: z.number().optional(),
  maxUses: z.number().optional(),
  validUntil: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;

import { z } from 'zod'

// Schema for Partner Forms
export const partnerFormSchema = z.object({
  name: z.string().min(2, 'Partner name must be at least 2 characters'),
  type: z.string().min(2, 'Partner type must be at least 2 characters'),
  country: z.string().min(2, 'Country name must be at least 2 characters'),
  organization: z.string().min(2, 'Organization must be at least 2 characters'),
  contact: z.string().min(2, 'Primary contact name must be at least 2 characters'),
  status: z.enum(['Draft', 'Approved', 'Accepted', 'Rejected']),
  notes: z.string().optional().or(z.literal('')),
})

export type PartnerFormValues = z.infer<typeof partnerFormSchema>

// Schema for Agreement Forms
export const agreementFormSchema = z
  .object({
    title: z.string().min(3, 'Agreement title must be at least 3 characters'),
    type: z.enum(['MoU', 'Contract', 'Service Level']),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    date: z.string().min(1, 'Effective date is required'),
    status: z.enum(['Draft', 'Approved', 'Accepted', 'Rejected']),
    summary: z.string().optional().or(z.literal('')),
  })
  .refine(
    data => {
      if (!data.startDate || !data.endDate) return true
      return new Date(data.endDate) >= new Date(data.startDate)
    },
    {
      message: 'End date must be on or after the start date',
      path: ['endDate'], // highlights the end date field as invalid
    }
  )

export type AgreementFormValues = z.infer<typeof agreementFormSchema>

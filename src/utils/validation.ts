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

// Schema for Event & Visit Forms
export const eventFormSchema = z.object({
  title: z.string().min(2, 'Name/Title is required'),
  type: z.string().min(1, 'Type is required'),
  date: z.string().min(1, 'Date is required'),
  venue: z.string().min(1, 'Venue/Location is required'),
  status: z.enum(['Draft', 'Approved', 'Accepted', 'Rejected']),
  category: z.enum(['Event', 'Visit']).optional(),
})
export type EventFormValues = z.infer<typeof eventFormSchema>

// Schema for Opportunity Forms
export const opportunityFormSchema = z.object({
  title: z.string().min(3, 'Opportunity title must be at least 3 characters'),
  source: z.string().min(2, 'Source must be at least 2 characters'),
  date: z.string().min(1, 'Date is required'),
  division: z.string().min(2, 'Division must be at least 2 characters'),
  status: z.enum(['Draft', 'Approved', 'Accepted', 'Rejected']),
})
export type OpportunityFormValues = z.infer<typeof opportunityFormSchema>

// Schema for Engagement Forms
export const engagementFormSchema = z.object({
  type: z.string().min(2, 'Engagement type must be at least 2 characters'),
  date: z.string().min(1, 'Date is required'),
  status: z.enum(['Draft', 'Approved', 'Accepted', 'Rejected']),
})
export type EngagementFormValues = z.infer<typeof engagementFormSchema>

// Schema for User Forms
export const userFormSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone number must be at least 7 characters'),
  position: z.string().min(2, 'Position must be at least 2 characters'),
  status: z.enum(['Active', 'Pending', 'Inactive']),
})
export type UserFormValues = z.infer<typeof userFormSchema>

export const roleFormSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  rolePermissionResources: z.array(
    z.object({
      permission_resource_id: z.number(),
      rolePermissionResourceActions: z.array(
        z.object({
          permission_action_id: z.number(),
        })
      ),
    })
  ),
})
export type RoleFormValues = z.infer<typeof roleFormSchema>

// Schema for Base Data Forms
export const baseDataFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(2, 'Description must be at least 2 characters'),
})
export type BaseDataFormValues = z.infer<typeof baseDataFormSchema>

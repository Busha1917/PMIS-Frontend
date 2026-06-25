import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@/api/client'
import type {
  PartnerRecord,
  AgreementRecord,
  OpportunityRecord,
  EventRecord,
  EngagementRecord,
  UserRecord,
  RoleRecord,
} from '@/types'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Partner', 'Agreement', 'Opportunity', 'Event', 'Engagement', 'User', 'Role'],
  endpoints: builder => ({
    // --- Partners Endpoints ---
    getPartners: builder.query<PartnerRecord[], void>({
      query: () => ({ url: '/partners', method: 'GET' }),
      providesTags: ['Partner'],
    }),
    createPartner: builder.mutation<PartnerRecord, Omit<PartnerRecord, 'id' | 'no'>>({
      query: data => ({ url: '/partners', method: 'POST', data }),
      invalidatesTags: ['Partner'],
    }),
    updatePartner: builder.mutation<PartnerRecord, { id: string; data: Partial<PartnerRecord> }>({
      query: ({ id, data }) => ({ url: `/partners/${id}`, method: 'PUT', data }),
      invalidatesTags: ['Partner'],
    }),
    deletePartner: builder.mutation<void, string>({
      query: id => ({ url: `/partners/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Partner'],
    }),

    // --- Agreements Endpoints ---
    getAgreements: builder.query<AgreementRecord[], void>({
      query: () => ({ url: '/agreements', method: 'GET' }),
      providesTags: ['Agreement'],
    }),
    createAgreement: builder.mutation<AgreementRecord, Omit<AgreementRecord, 'id' | 'no'>>({
      query: data => ({ url: '/agreements', method: 'POST', data }),
      invalidatesTags: ['Agreement'],
    }),

    // --- Opportunities Endpoints ---
    getOpportunities: builder.query<OpportunityRecord[], void>({
      query: () => ({ url: '/opportunities', method: 'GET' }),
      providesTags: ['Opportunity'],
    }),

    // --- Events Endpoints ---
    getEvents: builder.query<EventRecord[], void>({
      query: () => ({ url: '/events', method: 'GET' }),
      providesTags: ['Event'],
    }),

    // --- Engagements Endpoints ---
    getEngagements: builder.query<EngagementRecord[], void>({
      query: () => ({ url: '/engagements', method: 'GET' }),
      providesTags: ['Engagement'],
    }),

    // --- Users Endpoints ---
    getUsers: builder.query<UserRecord[], void>({
      query: () => ({ url: '/users', method: 'GET' }),
      providesTags: ['User'],
    }),

    // --- Roles Endpoints ---
    getRoles: builder.query<RoleRecord[], void>({
      query: () => ({ url: '/roles', method: 'GET' }),
      providesTags: ['Role'],
    }),
  }),
})

// Auto-generated hooks for querying/mutating endpoints
export const {
  useGetPartnersQuery,
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
  useGetAgreementsQuery,
  useCreateAgreementMutation,
  useGetOpportunitiesQuery,
  useGetEventsQuery,
  useGetEngagementsQuery,
  useGetUsersQuery,
  useGetRolesQuery,
} = apiSlice

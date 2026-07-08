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

const extractArray = (response: any) => {
  if (Array.isArray(response)) return response
  if (response?.data && Array.isArray(response.data)) return response.data
  if (response?.items && Array.isArray(response.items)) return response.items
  if (response?.data?.data && Array.isArray(response.data.data)) return response.data.data
  return []
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Partner', 'Agreement', 'Opportunity', 'Event', 'Engagement', 'User', 'Role'],
  endpoints: builder => ({
    // --- Auth Endpoints ---
    login: builder.mutation<
      { accessToken: string; refreshToken: string; user: any },
      { email: string; password: string }
    >({
      query: data => ({ url: '/auth/login', method: 'POST', data }),
    }),
    getProfile: builder.query<any, void>({
      query: () => ({ url: '/auth/profile', method: 'GET' }),
    }),
    // --- Partners Endpoints ---
    getPartners: builder.query<PartnerRecord[], void>({
      query: () => ({ url: '/partners', method: 'GET' }),
      providesTags: ['Partner'],
      transformResponse: extractArray,
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
      transformResponse: extractArray,
    }),
    createAgreement: builder.mutation<AgreementRecord, Omit<AgreementRecord, 'id' | 'no'>>({
      query: data => ({ url: '/agreements', method: 'POST', data }),
      invalidatesTags: ['Agreement'],
    }),

    // --- Opportunities Endpoints ---
    getOpportunities: builder.query<OpportunityRecord[], any>({
      query: params => ({ url: '/opportunities', method: 'GET', params }),
      providesTags: ['Opportunity'],
      transformResponse: extractArray,
    }),
    getOpportunityById: builder.query<OpportunityRecord, string>({
      query: id => ({ url: `/opportunities/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Opportunity', id }],
    }),
    createOpportunity: builder.mutation<OpportunityRecord, Partial<OpportunityRecord>>({
      query: data => ({ url: '/opportunities', method: 'POST', data }),
      invalidatesTags: ['Opportunity'],
    }),
    updateOpportunity: builder.mutation<
      OpportunityRecord,
      { id: string; data: Partial<OpportunityRecord> }
    >({
      query: ({ id, data }) => ({ url: `/opportunities/${id}`, method: 'PATCH', data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Opportunity', id }, 'Opportunity'],
    }),
    deleteOpportunity: builder.mutation<void, string>({
      query: id => ({ url: `/opportunities/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Opportunity'],
    }),
    screenOpportunity: builder.mutation<OpportunityRecord, string>({
      query: id => ({ url: `/opportunities/${id}/screen`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [{ type: 'Opportunity', id }, 'Opportunity'],
    }),
    verifyOpportunity: builder.mutation<OpportunityRecord, string>({
      query: id => ({ url: `/opportunities/${id}/verify`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [{ type: 'Opportunity', id }, 'Opportunity'],
    }),
    reviewOpportunity: builder.mutation<OpportunityRecord, string>({
      query: id => ({ url: `/opportunities/${id}/review`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [{ type: 'Opportunity', id }, 'Opportunity'],
    }),
    approveOpportunity: builder.mutation<OpportunityRecord, string>({
      query: id => ({ url: `/opportunities/${id}/approve`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [{ type: 'Opportunity', id }, 'Opportunity'],
    }),
    rejectOpportunity: builder.mutation<OpportunityRecord, string>({
      query: id => ({ url: `/opportunities/${id}/reject`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [{ type: 'Opportunity', id }, 'Opportunity'],
    }),
    convertOpportunity: builder.mutation<OpportunityRecord, string>({
      query: id => ({ url: `/opportunities/${id}/convert`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [{ type: 'Opportunity', id }, 'Opportunity'],
    }),

    // --- Events Endpoints ---
    getEvents: builder.query<EventRecord[], void>({
      query: () => ({ url: '/events', method: 'GET' }),
      providesTags: ['Event'],
      transformResponse: extractArray,
    }),

    // --- Engagements Endpoints ---
    getEngagements: builder.query<EngagementRecord[], void>({
      query: () => ({ url: '/engagements', method: 'GET' }),
      providesTags: ['Engagement'],
      transformResponse: extractArray,
    }),
    getEngagementById: builder.query<EngagementRecord, string>({
      query: id => ({ url: `/engagements/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Engagement', id }],
    }),
    createEngagement: builder.mutation<EngagementRecord, Partial<EngagementRecord>>({
      query: data => ({ url: '/engagements', method: 'POST', data }),
      invalidatesTags: ['Engagement'],
    }),
    updateEngagement: builder.mutation<
      EngagementRecord,
      { id: string; data: Partial<EngagementRecord> }
    >({
      query: ({ id, data }) => ({ url: `/engagements/${id}`, method: 'PATCH', data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Engagement', id }, 'Engagement'],
    }),
    deleteEngagement: builder.mutation<{ success: boolean; id: string }, string>({
      query: id => ({ url: `/engagements/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Engagement', id }, 'Engagement'],
    }),
    approveEngagement: builder.mutation<EngagementRecord, string>({
      query: id => ({ url: `/engagements/${id}/approve`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [{ type: 'Engagement', id }, 'Engagement'],
    }),
    completeEngagement: builder.mutation<EngagementRecord, string>({
      query: id => ({ url: `/engagements/${id}/complete`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [{ type: 'Engagement', id }, 'Engagement'],
    }),
    cancelEngagement: builder.mutation<EngagementRecord, string>({
      query: id => ({ url: `/engagements/${id}/cancel`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [{ type: 'Engagement', id }, 'Engagement'],
    }),

    // --- Users Endpoints ---
    getUsers: builder.query<UserRecord[], void>({
      query: () => ({ url: '/users', method: 'GET' }),
      providesTags: ['User'],
      transformResponse: extractArray,
    }),

    // --- Roles Endpoints ---
    getRoles: builder.query<RoleRecord[], void>({
      query: () => ({ url: '/roles', method: 'GET' }),
      providesTags: ['Role'],
      transformResponse: extractArray,
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
  useGetOpportunityByIdQuery,
  useCreateOpportunityMutation,
  useUpdateOpportunityMutation,
  useDeleteOpportunityMutation,
  useScreenOpportunityMutation,
  useVerifyOpportunityMutation,
  useReviewOpportunityMutation,
  useApproveOpportunityMutation,
  useRejectOpportunityMutation,
  useConvertOpportunityMutation,
  useGetEventsQuery,
  useGetEngagementsQuery,
  useGetEngagementByIdQuery,
  useCreateEngagementMutation,
  useUpdateEngagementMutation,
  useDeleteEngagementMutation,
  useApproveEngagementMutation,
  useCompleteEngagementMutation,
  useCancelEngagementMutation,
  useGetUsersQuery,
  useGetRolesQuery,
  useLoginMutation,
  useGetProfileQuery,
} = apiSlice

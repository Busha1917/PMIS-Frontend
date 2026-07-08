import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@/api/client'
import type {
  PartnerRecord,
  AgreementRecord,
  OpportunityRecord,
  EventRecord,
  VisitRecord,
  EngagementRecord,
  UserRecord,
  RoleRecord,
  DivisionRecord,
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
  tagTypes: [
    'Partner',
    'Agreement',
    'Opportunity',
    'Event',
    'Visit',
    'Engagement',
    'User',
    'Role',
    'Division',
  ],
  endpoints: builder => ({
    // --- Auth Endpoints ---
    login: builder.mutation<
      { accessToken: string; refreshToken: string; user: any },
      { email: string; password: string }
    >({
      query: data => ({ url: '/auth/login', method: 'POST', data }),
    }),
    register: builder.mutation<
      any,
      {
        fullName: string
        email: string
        password: string
        phone?: string
        position?: string
        divisionId?: string
      }
    >({
      query: data => ({ url: '/auth/register', method: 'POST', data }),
      invalidatesTags: ['User'],
    }),
    refreshToken: builder.mutation<
      { accessToken: string; refreshToken: string },
      { refreshToken: string }
    >({
      query: data => ({ url: '/auth/refresh', method: 'POST', data }),
    }),
    logoutApi: builder.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
    getProfile: builder.query<any, void>({
      query: () => ({ url: '/auth/profile', method: 'GET' }),
    }),
    changePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
      query: data => ({ url: '/auth/change-password', method: 'PATCH', data }),
    }),
    verifyEmail: builder.mutation<void, { token?: string }>({
      query: data => ({ url: '/auth/verify-email', method: 'POST', data }),
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
    createAgreement: builder.mutation<AgreementRecord, Partial<AgreementRecord>>({
      query: data => ({ url: '/agreements', method: 'POST', data }),
      invalidatesTags: ['Agreement'],
    }),
    getAgreementById: builder.query<AgreementRecord, string>({
      query: id => ({ url: `/agreements/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Agreement', id }],
    }),
    updateAgreement: builder.mutation<
      AgreementRecord,
      { id: string | number } & Partial<AgreementRecord>
    >({
      query: ({ id, ...patch }) => ({
        url: `/agreements/${id}`,
        method: 'PATCH',
        data: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Agreement', id }, 'Agreement'],
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
    getEvents: builder.query<EventRecord[], Record<string, any>>({
      query: params => ({ url: '/events', method: 'GET', params }),
      providesTags: ['Event'],
      transformResponse: extractArray,
    }),
    getEventById: builder.query<EventRecord, string>({
      query: id => ({ url: `/events/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Event', id }],
    }),
    createEvent: builder.mutation<EventRecord, Partial<EventRecord>>({
      query: data => ({ url: '/events', method: 'POST', data }),
      invalidatesTags: ['Event'],
    }),
    updateEvent: builder.mutation<EventRecord, { id: string | number; data: Partial<EventRecord> }>(
      {
        query: ({ id, data }) => ({ url: `/events/${id}`, method: 'PATCH', data }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Event', id: String(id) }, 'Event'],
      }
    ),
    deleteEvent: builder.mutation<void, string | number>({
      query: id => ({ url: `/events/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Event'],
    }),
    verifyEvent: builder.mutation<EventRecord, string | number>({
      query: id => ({ url: `/events/${id}/verify`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [{ type: 'Event', id: String(id) }, 'Event'],
    }),
    reviewEvent: builder.mutation<EventRecord, string | number>({
      query: id => ({ url: `/events/${id}/review`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [{ type: 'Event', id: String(id) }, 'Event'],
    }),
    createEventOutcome: builder.mutation<EventRecord, { id: string | number; data: any }>({
      query: ({ id, data }) => ({ url: `/events/${id}/outcomes`, method: 'POST', data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Event', id: String(id) }, 'Event'],
    }),
    updateEventOutcome: builder.mutation<
      EventRecord,
      { id: string | number; outcomeId: string | number; data: any }
    >({
      query: ({ id, outcomeId, data }) => ({
        url: `/events/${id}/outcomes/${outcomeId}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Event', id: String(id) }, 'Event'],
    }),

    // --- Visits Endpoints ---
    getVisits: builder.query<VisitRecord[], Record<string, any>>({
      query: params => ({ url: '/visits', method: 'GET', params }),
      providesTags: ['Visit'],
      transformResponse: extractArray,
    }),
    getVisitById: builder.query<VisitRecord, string>({
      query: id => ({ url: `/visits/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Visit', id }],
    }),
    createVisit: builder.mutation<VisitRecord, Partial<VisitRecord>>({
      query: data => ({ url: '/visits', method: 'POST', data }),
      invalidatesTags: ['Visit'],
    }),
    updateVisit: builder.mutation<VisitRecord, { id: string; data: Partial<VisitRecord> }>({
      query: ({ id, data }) => ({ url: `/visits/${id}`, method: 'PATCH', data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Visit', id }, 'Visit'],
    }),
    deleteVisit: builder.mutation<void, string>({
      query: id => ({ url: `/visits/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Visit'],
    }),
    createVisitOutcome: builder.mutation<VisitRecord, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/visits/${id}/outcomes`, method: 'POST', data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Visit', id }, 'Visit'],
    }),
    updateVisitOutcome: builder.mutation<VisitRecord, { id: string; outcomeId: string; data: any }>(
      {
        query: ({ id, outcomeId, data }) => ({
          url: `/visits/${id}/outcomes/${outcomeId}`,
          method: 'PATCH',
          data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Visit', id }, 'Visit'],
      }
    ),

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

    // --- Divisions Endpoints ---
    getDivisions: builder.query<DivisionRecord[], { includeDeleted?: boolean } | void>({
      query: params => ({ url: '/divisions', method: 'GET', params: params ?? {} }),
      providesTags: ['Division'],
      transformResponse: extractArray,
    }),
    getDivisionById: builder.query<DivisionRecord, string>({
      query: id => ({ url: `/divisions/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Division', id }],
    }),
    getDivisionUsers: builder.query<UserRecord[], string>({
      query: id => ({ url: `/divisions/${id}/users`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Division', id }],
      transformResponse: extractArray,
    }),
    createDivision: builder.mutation<DivisionRecord, { name: string; directorId?: string }>({
      query: data => ({ url: '/divisions', method: 'POST', data }),
      invalidatesTags: ['Division'],
    }),
    updateDivision: builder.mutation<
      DivisionRecord,
      { id: string; name?: string; directorId?: string }
    >({
      query: ({ id, ...data }) => ({ url: `/divisions/${id}`, method: 'PATCH', data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Division', id }, 'Division'],
    }),
    deleteDivision: builder.mutation<void, string>({
      query: id => ({ url: `/divisions/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Division'],
    }),
    permanentDeleteDivision: builder.mutation<void, string>({
      query: id => ({ url: `/divisions/${id}/permanent`, method: 'DELETE' }),
      invalidatesTags: ['Division'],
    }),
    restoreDivision: builder.mutation<DivisionRecord, string>({
      query: id => ({ url: `/divisions/${id}/restore`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [{ type: 'Division', id }, 'Division'],
    }),
    assignDirector: builder.mutation<DivisionRecord, { id: string; userId: string }>({
      query: ({ id, userId }) => ({ url: `/divisions/${id}/director/${userId}`, method: 'POST' }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Division', id }, 'Division'],
    }),
    removeDirector: builder.mutation<DivisionRecord, string>({
      query: id => ({ url: `/divisions/${id}/director`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Division', id }, 'Division'],
    }),

    // --- Roles Endpoints ---
    getRoles: builder.query<RoleRecord[], void>({
      query: () => ({ url: '/roles', method: 'GET' }),
      providesTags: ['Role'],
      transformResponse: extractArray,
    }),
    getRoleById: builder.query<RoleRecord, string>({
      query: id => ({ url: `/roles/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Role', id }],
    }),
    getRoleByName: builder.query<RoleRecord, string>({
      query: name => ({ url: `/roles/name/${name}`, method: 'GET' }),
    }),
    createRole: builder.mutation<RoleRecord, { name: string; description?: string }>({
      query: data => ({ url: '/roles', method: 'POST', data }),
      invalidatesTags: ['Role'],
    }),
    updateRole: builder.mutation<RoleRecord, { id: string; name?: string; description?: string }>({
      query: ({ id, ...data }) => ({ url: `/roles/${id}`, method: 'PATCH', data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Role', id }, 'Role'],
    }),
    deleteRole: builder.mutation<void, string>({
      query: id => ({ url: `/roles/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Role'],
    }),
    permanentDeleteRole: builder.mutation<void, string>({
      query: id => ({ url: `/roles/${id}/permanent`, method: 'DELETE' }),
      invalidatesTags: ['Role'],
    }),
    restoreRole: builder.mutation<RoleRecord, string>({
      query: id => ({ url: `/roles/${id}/restore`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [{ type: 'Role', id }, 'Role'],
    }),
    addPermissionToRole: builder.mutation<RoleRecord, { roleId: string; permissionId: string }>({
      query: ({ roleId, permissionId }) => ({
        url: `/roles/${roleId}/permissions/${permissionId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { roleId }) => [{ type: 'Role', id: roleId }, 'Role'],
    }),
    removePermissionFromRole: builder.mutation<
      RoleRecord,
      { roleId: string; permissionId: string }
    >({
      query: ({ roleId, permissionId }) => ({
        url: `/roles/${roleId}/permissions/${permissionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { roleId }) => [{ type: 'Role', id: roleId }, 'Role'],
    }),
    bulkAddPermissionsToRole: builder.mutation<
      RoleRecord,
      { roleId: string; permissionIds: string[] }
    >({
      query: ({ roleId, permissionIds }) => ({
        url: `/roles/${roleId}/permissions`,
        method: 'POST',
        data: { permissionIds },
      }),
      invalidatesTags: (result, error, { roleId }) => [{ type: 'Role', id: roleId }, 'Role'],
    }),
    bulkRemovePermissionsFromRole: builder.mutation<
      RoleRecord,
      { roleId: string; permissionIds: string[] }
    >({
      query: ({ roleId, permissionIds }) => ({
        url: `/roles/${roleId}/permissions`,
        method: 'DELETE',
        data: { permissionIds },
      }),
      invalidatesTags: (result, error, { roleId }) => [{ type: 'Role', id: roleId }, 'Role'],
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
  useGetAgreementByIdQuery,
  useCreateAgreementMutation,
  useUpdateAgreementMutation,
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
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useVerifyEventMutation,
  useReviewEventMutation,
  useCreateEventOutcomeMutation,
  useUpdateEventOutcomeMutation,
  useGetVisitsQuery,
  useGetVisitByIdQuery,
  useCreateVisitMutation,
  useUpdateVisitMutation,
  useDeleteVisitMutation,
  useCreateVisitOutcomeMutation,
  useUpdateVisitOutcomeMutation,
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
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutApiMutation,
  useChangePasswordMutation,
  useVerifyEmailMutation,
  useGetProfileQuery,
} = apiSlice

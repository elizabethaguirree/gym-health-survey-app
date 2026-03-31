import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { ErrorResponse, HealthStatus, SurveySubmission, SurveySubmissionResult } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * Returns server health status
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * Stores an anonymous gym and health habits survey response in Supabase
 * @summary Submit survey response
 */
export declare const getSubmitSurveyUrl: () => string;
export declare const submitSurvey: (surveySubmission: SurveySubmission, options?: RequestInit) => Promise<SurveySubmissionResult>;
export declare const getSubmitSurveyMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitSurvey>>, TError, {
        data: BodyType<SurveySubmission>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof submitSurvey>>, TError, {
    data: BodyType<SurveySubmission>;
}, TContext>;
export type SubmitSurveyMutationResult = NonNullable<Awaited<ReturnType<typeof submitSurvey>>>;
export type SubmitSurveyMutationBody = BodyType<SurveySubmission>;
export type SubmitSurveyMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Submit survey response
 */
export declare const useSubmitSurvey: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitSurvey>>, TError, {
        data: BodyType<SurveySubmission>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof submitSurvey>>, TError, {
    data: BodyType<SurveySubmission>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map
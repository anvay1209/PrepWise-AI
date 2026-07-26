import { useCallback, useContext } from "react";
import {
    downloadInterviewReportPdf,
    generateInterviewReport,
    getAllInterviewReports,
    getInterviewReportById,
} from "../services/inteview.api";
import { InterviewContext } from "../interiew.context";

export const useInterview = () => {
    const context = useContext(InterviewContext);

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const {
        loading,
        setLoading,
        error,
        setError,
        report,
        setReport,
        reports,
        setReports,
    } = context;

    const generateReport = useCallback(async (jobDescription, resume, selfDescription) => {
        setLoading(true);
        setError(null);
        try {
            const response = await generateInterviewReport(jobDescription, resume, selfDescription);
            setReport(response.data);
            return response.data;
        } catch (requestError) {
            const message = requestError.response?.data?.message || requestError.message || "Failed to generate report";
            setError(message);
            throw requestError;
        } finally {
            setLoading(false);
        }
    }, [setError, setLoading, setReport]);

    const getReportById = useCallback(async (interviewId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getInterviewReportById(interviewId);
            setReport(response.data);
            return response.data;
        } catch (requestError) {
            const message = requestError.response?.data?.message || requestError.message || "Failed to fetch report";
            setError(message);
            throw requestError;
        } finally {
            setLoading(false);
        }
    }, [setError, setLoading, setReport]);

    const getAllReports = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllInterviewReports();
            setReports(response.data || []);
            return response.data || [];
        } catch (requestError) {
            const message = requestError.response?.data?.message || requestError.message || "Failed to fetch reports";
            setError(message);
            throw requestError;
        } finally {
            setLoading(false);
        }
    }, [setError, setLoading, setReports]);

    const downloadPdf = useCallback(async (interviewId) => {
        const blob = await downloadInterviewReportPdf(interviewId);
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `interview-report-${interviewId}.pdf`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(url);
    }, []);

    return {
        generateReport,
        getReportById,
        getAllReports,
        downloadPdf,
        loading,
        error,
        report,
        reports,
    };
};

"use client";

import { useState, useEffect, useCallback } from "react";
import { Briefcase, MapPin, Calendar, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import HighlightText from "@/app/components/ui/HighlightText";

export default function StudentJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchJobs = useCallback(async (page, search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: "20" });
      if (search.trim()) params.set("search", search.trim());
      const res = await fetch(`/api/student-jobs?${params}`);
      const data = await res.json();
      setJobs(data.jobs || []);
      setTotalPages(data.totalPages || 0);
      setTotalJobs(data.totalJobs || 0);
      setCurrentPage(data.currentPage || 1);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(currentPage, searchQuery);
  }, [currentPage, searchQuery, fetchJobs]);

  function handleSearch(e) {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  }

  function handleClearSearch() {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  }

  function handlePrev() {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  }

  function handleNext() {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Jobs</h1>
            <p className="text-gray-600 mt-1">
              {totalJobs > 0
                ? `Showing ${jobs.length} of ${totalJobs} approved opportunity${totalJobs !== 1 ? "ies" : "y"}`
                : "No job listings available"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, company, skills, location, or keywords..."
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-xl font-semibold text-gray-600">
              {searchQuery ? "No matching jobs found" : "No jobs found"}
            </h2>
            <p className="text-gray-500 mt-1">
              {searchQuery
                ? "Try different keywords or clear your search."
                : "Check back later for new opportunities."}
            </p>
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold text-gray-900">
                        <HighlightText text={job.title} query={searchQuery} />
                      </h2>
                      <p className="text-indigo-600 font-medium mt-1">
                        <HighlightText text={job.company} query={searchQuery} />
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <HighlightText text={job.location} query={searchQuery} />
                          </span>
                        )}
                        {job.job_type && (
                          <span className="capitalize">{job.job_type.replace("-", " ")}</span>
                        )}
                        {job.experience_level && (
                          <span className="capitalize">{job.experience_level.replace("-", " ")}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {job.salary_range && (
                        <p className="mt-2 text-sm font-medium text-green-600">{job.salary_range}</p>
                      )}
                      {job.skills && (
                        <p className="mt-2 text-sm text-gray-500">
                          <span className="font-medium text-gray-700">Skills: </span>
                          <HighlightText text={job.skills} query={searchQuery} />
                        </p>
                      )}
                      <p className="mt-3 text-gray-600 line-clamp-3">
                        <HighlightText text={job.description} query={searchQuery} />
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <>
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 7) {
                        pageNum = i + 1;
                      } else if (currentPage <= 4) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNum = totalPages - 6 + i;
                      } else {
                        pageNum = currentPage - 3 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? "bg-indigo-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Page {currentPage} of {totalPages}
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

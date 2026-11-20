
import { useEffect, useMemo, useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import { 
  FaBookOpen, 
  FaSearch, 
  FaEye, 
  FaDownload, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaFilter, 
  FaArrowRight, 
  FaArrowLeft,
  FaChartBar, 
  FaUser, 
  FaCalendarAlt, 
  FaFileAlt, 
  FaSyncAlt, 
} from "react-icons/fa"; 
 
import { useReports } from "../../context/ReportContext"; 
 
const DigitalLibraryReport = () => { 
  const navigate = useNavigate(); 
 
  const { 
    digitalLibraryReport, 
    getDigitalLibraryReport, 
    loading, 
    error, 
  } = useReports(); 
 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [statusFilter, setStatusFilter] = useState("all"); 
  const [categoryFilter, setCategoryFilter] = useState("all"); 
 
  useEffect(() => { 
    getDigitalLibraryReport(); 
  }, []); 
 
  const report = 
    digitalLibraryReport?.report || 
    digitalLibraryReport || 
    {}; 
 
  const digitalBooks = Array.isArray(report?.digitalBooks) 
    ? report.digitalBooks 
    : Array.isArray(report?.books) 
    ? report.books 
    : Array.isArray(report?.data) 
    ? report.data 
    : Array.isArray(report?.data?.digitalBooks) 
    ? report.data.digitalBooks 
    : Array.isArray(report?.data?.books) 
    ? report.data.books 
    : []; 
 
  const summary = report?.summary || report?.stats || {}; 
 
  const getTitle = (item) => { 
    if (!item) return "Untitled Digital Book"; 
 
    return ( 
      item.title || 
      item.bookTitle || 
      item.name || 
      item.book?.title || 
      "Untitled Digital Book" 
    ); 
  }; 
 
  const getAuthor = (item) => { 
    if (!item) return "Unknown Author"; 
 
    if (typeof item.author === "string") { 
      return item.author; 
    } 
 
    if (item.author && typeof item.author === "object") { 
      return ( 
        item.author.name || 
        item.author.fullName || 
        item.author.username || 
        "" 
      ); 
    } 
 
    if (item.book?.author) { 
      if (typeof item.book.author === "string") { 
        return item.book.author; 
      } 
 
      if (typeof item.book.author === "object") { 
        return ( 
          item.book.author.name || 
          item.book.author.fullName || 
          item.book.author.username || 
          "" 
        ); 
      } 
    } 
 
    return ( 
      item.authorName || 
      item.writer || 
      item.writerName || 
      "Unknown Author" 
    ); 
  }; 
 
  const getCategory = (item) => { 
    if (!item) return "Uncategorized"; 
 
    if (typeof item.category === "string") { 
      return item.category; 
    } 
 
    if (item.category && typeof item.category === "object") { 
      return ( 
        item.category.name || 
        item.category.title || 
        item.category.categoryName || 
        "Uncategorized" 
      ); 
    } 
 
    if (item.book?.category) { 
      if (typeof item.book.category === "string") { 
        return item.book.category; 
      } 
 
      if (typeof item.book.category === "object") { 
        return ( 
          item.book.category.name || 
          item.book.category.title || 
          item.book.category.categoryName || 
          "Uncategorized" 
        ); 
      } 
    } 
 
    return item.categoryName || "Uncategorized"; 
  }; 
 
  const getStatus = (item) => { 
    if (!item) return "Unknown"; 
 
    return ( 
      item.status || 
      item.bookStatus || 
      item.state || 
      "Unknown" 
    ); 
  }; 
 
  const getViews = (item) => { 
    const value = 
      item?.views ?? 
      item?.viewCount ?? 
      item?.totalViews ?? 
      0; 
 
    return Number(value) || 0; 
  }; 
 
  const getDownloads = (item) => { 
    const value = 
      item?.downloads ?? 
      item?.downloadCount ?? 
      item?.totalDownloads ?? 
      0; 
 
    return Number(value) || 0; 
  }; 
 
  const getFileType = (item) => { 
    return ( 
      item?.fileType || 
      item?.format || 
      item?.file?.type || 
      item?.file?.mimeType || 
      "Digital" 
    ); 
  }; 
 
  const getDate = (item) => { 
    const date = 
      item?.createdAt || 
      item?.uploadedAt || 
      item?.publishedAt || 
      item?.date; 
 
    if (!date) return "—"; 
 
    const parsedDate = new Date(date); 
 
    if (Number.isNaN(parsedDate.getTime())) { 
      return "—"; 
    } 
 
    return parsedDate.toLocaleDateString(); 
  }; 
 
  const normalizedStatus = (status) => 
    String(status || "") 
      .toLowerCase() 
      .trim(); 
 
  const categories = useMemo(() => { 
    const values = digitalBooks 
      .map((book) => getCategory(book)) 
      .filter(Boolean); 
 
    return [...new Set(values)]; 
  }, [digitalBooks]); 
 
  const filteredBooks = useMemo(() => { 
    return digitalBooks.filter((book) => { 
      const title = getTitle(book).toLowerCase(); 
      const author = getAuthor(book).toLowerCase(); 
      const category = getCategory(book).toLowerCase(); 
 
      const search = searchTerm.toLowerCase().trim(); 
 
      const matchesSearch = 
        !search || 
        title.includes(search) || 
        author.includes(search) || 
        category.includes(search); 
 
      const status = normalizedStatus(getStatus(book)); 
 
      const matchesStatus = 
        statusFilter === "all" || 
        status === statusFilter.toLowerCase(); 
 
      const matchesCategory = 
        categoryFilter === "all" || 
        category === categoryFilter.toLowerCase(); 
 
      return ( 
        matchesSearch && 
        matchesStatus && 
        matchesCategory 
      ); 
    }); 
  }, [ 
    digitalBooks, 
    searchTerm, 
    statusFilter, 
    categoryFilter, 
  ]); 
 
  const totalBooks = 
    summary?.totalDigitalBooks ?? 
    summary?.digitalBooks ?? 
    summary?.totalBooks ?? 
    digitalBooks.length; 
 
  const totalViews = 
    summary?.totalViews ?? 
    digitalBooks.reduce( 
      (total, book) => total + getViews(book), 
      0 
    ); 
 
  const totalDownloads = 
    summary?.totalDownloads ?? 
    digitalBooks.reduce( 
      (total, book) => total + getDownloads(book), 
      0 
    ); 
 
  const activeBooks = 
    summary?.activeBooks ?? 
    digitalBooks.filter((book) => { 
      const status = normalizedStatus(getStatus(book)); 
 
      return ( 
        status === "active" || 
        status === "published" 
      ); 
    }).length; 
 
  const inactiveBooks = 
    summary?.inactiveBooks ?? 
    digitalBooks.filter((book) => { 
      const status = normalizedStatus(getStatus(book)); 
 
      return ( 
        status === "inactive" || 
        status === "disabled" || 
        status === "archived" 
      ); 
    }).length; 
 
  const statusCounts = useMemo(() => { 
    const counts = {}; 
 
    digitalBooks.forEach((book) => { 
      const status = getStatus(book) || "Unknown"; 
 
      const key = 
        String(status).charAt(0).toUpperCase() + 
        String(status).slice(1).toLowerCase(); 
 
      counts[key] = (counts[key] || 0) + 1; 
    }); 
 
    return Object.entries(counts).sort( 
      (a, b) => b[1] - a[1] 
    ); 
  }, [digitalBooks]); 
 
  const categoryCounts = useMemo(() => { 
    const counts = {}; 
 
    digitalBooks.forEach((book) => { 
      const category = 
        getCategory(book) || "Uncategorized"; 
 
      counts[category] = 
        (counts[category] || 0) + 1; 
    }); 
 
    return Object.entries(counts) 
      .sort((a, b) => b[1] - a[1]) 
      .slice(0, 8); 
  }, [digitalBooks]); 
 
  const maxCategoryCount = 
    categoryCounts.length > 0 
      ? Math.max( 
          ...categoryCounts.map( 
            (item) => item[1] 
          ) 
        ) 
      : 1; 
 
  const maxStatusCount = 
    statusCounts.length > 0 
      ? Math.max( 
          ...statusCounts.map( 
            (item) => item[1] 
          ) 
        ) 
      : 1; 
 
  const handleRefresh = () => { 
    getDigitalLibraryReport(); 
  }; 
 
  const handleViewBook = (id) => { 
    if (!id) return; 
 
    navigate(`/digital-library/view/${id}`); 
  }; 
 
  return ( 
    <div className="min-h-screen overflow-hidden bg-slate-100 p-4 text-slate-900 md:p-6"> 
 
      {/* Background Decorations */} 
      <div className="pointer-events-none fixed -left-32 -top-32 h-96 w-96 rounded-full bg-[#890C25]/10 blur-3xl" /> 
      <div className="pointer-events-none fixed -right-32 top-1/3 h-[28rem] w-[28rem] rounded-full bg-blue-600/10 blur-3xl" /> 
      <div className="pointer-events-none fixed -bottom-40 left-1/3 h-80 w-80 rounded-full bg-[#D58A98]/10 blur-3xl" /> 
 
      <div className="relative   mt-10 mx-auto max-w-7xl space-y-6"> 
 
        {/* ================= HEADER ================= */} 
        <div 
          className="group relative overflow-hidden rounded-[2rem] shadow-2xl shadow-[#890C25]/20" 
          style={{ 
            background: 
              "linear-gradient(135deg, #890C25 0%, #6f091e 55%, #420512 100%)", 
          }} 
        > 
          {/* Animated Top Line */} 
          <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-transparent via-white/80 to-transparent animate-pulse" /> 
 
          {/* Decorative Rings */} 
          <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full border border-white/10" /> 
          <div className="absolute -right-10 -top-14 h-52 w-52 rounded-full border border-white/10" /> 
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-white/10" /> 
          <div className="absolute right-1/3 top-10 h-20 w-20 rounded-full bg-white/5 blur-xl animate-pulse" /> 
 
          <div className="relative z-10 flex flex-col gap-6 p-6 md:p-8 lg:flex-row lg:items-center lg:justify-between"> 
 
            <div> 
              <div className="mb-4 flex flex-wrap items-center gap-3"> 

             
 
                <div className="rounded-2xl border border-white/15 bg-white/10 p-3 shadow-lg backdrop-blur-md"> 
                  <FaBookOpen className="text-2xl text-white" /> 
                </div> 
    {/* Back Button */}
                <button
                  type="button"
                  onClick={() => navigate("/reports")}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
                >
                  <FaArrowLeft />
                  Back to Reports
                </button>
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md"> 
                  Reports & Analytics 
                </span> 
 
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80"> 
                  Digital Library 
                </span> 
 
              </div> 
 
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl"> 
                Digital Library Report 
              </h1> 
 
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75 md:text-base"> 
                Monitor digital books, views, downloads, 
                categories, activity and library status 
                from one professional analytics dashboard. 
              </p> 
            </div> 
 
            <button 
              type="button" 
              onClick={handleRefresh} 
              className="group/refresh inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white px-5 py-3 text-sm font-bold text-[#890C25] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-slate-50 hover:shadow-2xl" 
            > 
              <FaSyncAlt 
                className={`transition-transform duration-500 ${ 
                  loading 
                    ? "animate-spin" 
                    : "group-hover/refresh:rotate-180" 
                }`} 
              /> 
              Refresh Report 
            </button> 
 
          </div> 
 
          <div className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-transparent via-[#D58A98] to-transparent" /> 
        </div> 
 
        {/* ================= ERROR ================= */} 
        {error && ( 
          <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-white px-5 py-4 shadow-lg"> 
            <div className="absolute left-0 top-0 h-full w-1 bg-red-500" /> 
 
            <div className="flex items-center gap-3 text-sm font-medium text-red-700"> 
              <FaTimesCircle className="text-lg" /> 
              {error} 
            </div> 
          </div> 
        )} 
 
        {/* ================= STATS ================= */} 
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"> 
 
          {/* Digital Books */} 
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"> 
 
            <div className="absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-[#890C25] to-transparent transition-transform duration-700 group-hover:scale-x-100" /> 
 
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#890C25]/5 transition-transform duration-500 group-hover:scale-150" /> 
            <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full border border-[#890C25]/10" /> 
 
            <div className="relative z-10 flex items-start justify-between"> 
              <div> 
                <p className="text-sm font-semibold text-slate-500"> 
                  Digital Books 
                </p> 
 
                <h2 className="mt-2 text-3xl font-extrabold text-[#890C25]"> 
                  {totalBooks} 
                </h2> 
 
                <p className="mt-1 text-xs text-slate-400"> 
                  Total available records 
                </p> 
              </div> 
 
              <div className="rounded-2xl bg-[#890C25]/10 p-3.5 text-[#890C25] shadow-sm"> 
                <FaBookOpen className="text-lg" /> 
              </div> 
            </div> 
 
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100"> 
              <div className="h-full w-3/4 rounded-full bg-[#890C25]" /> 
            </div> 
          </div> 
 
          {/* Views */} 
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"> 
 
            <div className="absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent transition-transform duration-700 group-hover:scale-x-100" /> 
 
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-50 transition-transform duration-500 group-hover:scale-150" /> 
 
            <div className="relative z-10 flex items-start justify-between"> 
              <div> 
                <p className="text-sm font-semibold text-slate-500"> 
                  Total Views 
                </p> 
 
                <h2 className="mt-2 text-3xl font-extrabold text-[#890C25]"> 
                  {totalViews} 
                </h2> 
 
                <p className="mt-1 text-xs text-slate-400"> 
                  Digital reading activity 
                </p> 
              </div> 
 
              <div className="rounded-2xl bg-emerald-50 p-3.5 text-emerald-600 shadow-sm"> 
                <FaEye className="text-lg" /> 
              </div> 
            </div> 
 
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100"> 
              <div className="h-full w-4/5 rounded-full bg-emerald-500" /> 
            </div> 
          </div> 
 
          {/* Downloads */} 
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"> 
 
            <div className="absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-violet-500 to-transparent transition-transform duration-700 group-hover:scale-x-100" /> 
 
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-50 transition-transform duration-500 group-hover:scale-150" /> 
 
            <div className="relative z-10 flex items-start justify-between"> 
              <div> 
                <p className="text-sm font-semibold text-slate-500"> 
                  Downloads 
                </p> 
 
                <h2 className="mt-2 text-3xl font-extrabold text-[#890C25]"> 
                  {totalDownloads} 
                </h2> 
 
                <p className="mt-1 text-xs text-slate-400"> 
                  Files downloaded 
                </p> 
              </div> 
 
              <div className="rounded-2xl bg-violet-50 p-3.5 text-violet-600 shadow-sm"> 
                <FaDownload className="text-lg" /> 
              </div> 
            </div> 
 
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100"> 
              <div className="h-full w-2/3 rounded-full bg-violet-500" /> 
            </div> 
          </div> 
 
          {/* Active */} 
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"> 
 
            <div className="absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-green-500 to-transparent transition-transform duration-700 group-hover:scale-x-100" /> 
 
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-green-50 transition-transform duration-500 group-hover:scale-150" /> 
 
            <div className="relative z-10 flex items-start justify-between"> 
              <div> 
                <p className="text-sm font-semibold text-slate-500"> 
                  Active Books 
                </p> 
 
                <h2 className="mt-2 text-3xl font-extrabold text-[#890C25]"> 
                  {activeBooks} 
                </h2> 
 
                <p className="mt-1 text-xs text-slate-400"> 
                  Active / published records 
                </p> 
              </div> 
 
              <div className="rounded-2xl bg-green-50 p-3.5 text-green-600 shadow-sm"> 
                <FaCheckCircle className="text-lg" /> 
              </div> 
            </div> 
 
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100"> 
              <div className="h-full w-4/5 rounded-full bg-green-500" /> 
            </div> 
          </div> 
        </div> 
 
        {/* ================= LIBRARY STATUS + USAGE ================= */} 
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2"> 
 
          {/* Library Status */} 
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"> 
 
            <div className="absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-[#890C25] to-transparent transition-transform duration-700 group-hover:scale-x-100" /> 
 
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#890C25]/5 transition-transform duration-700 group-hover:scale-110" /> 
            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full border border-[#890C25]/10" /> 
 
            <div className="relative z-10 flex items-center justify-between"> 
              <div> 
                <h2 className="text-xl font-bold text-slate-800"> 
                  Library Status 
                </h2> 
 
                <p className="mt-1 text-sm text-slate-500"> 
                  Current digital library availability 
                </p> 
              </div> 
 
              <div className="rounded-2xl bg-[#890C25]/10 p-3.5 text-[#890C25]"> 
                <FaChartBar /> 
              </div> 
            </div> 
 
            <div className="relative z-10 mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"> 
 
              <div className="group/status relative overflow-hidden rounded-2xl border border-green-100 bg-green-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"> 
                <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-green-100/60 transition-transform duration-500 group-hover/status:scale-150" /> 
 
                <div className="relative z-10 flex items-center gap-3"> 
                  <div className="rounded-xl bg-white p-2.5 text-green-600 shadow-sm"> 
                    <FaCheckCircle /> 
                  </div> 
 
                  <span className="text-sm font-bold text-slate-700"> 
                    Active 
                  </span> 
                </div> 
 
                <p className="relative z-10 mt-4 text-3xl font-extrabold text-green-700"> 
                  {activeBooks} 
                </p> 
 
                <p className="relative z-10 mt-1 text-xs text-green-700/70"> 
                  Published & accessible 
                </p> 
              </div> 
 
              <div className="group/status relative overflow-hidden rounded-2xl border border-red-100 bg-red-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"> 
                <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-red-100/60 transition-transform duration-500 group-hover/status:scale-150" /> 
 
                <div className="relative z-10 flex items-center gap-3"> 
                  <div className="rounded-xl bg-white p-2.5 text-red-600 shadow-sm"> 
                    <FaTimesCircle /> 
                  </div> 
 
                  <span className="text-sm font-bold text-slate-700"> 
                    Inactive 
                  </span> 
                </div> 
 
                <p className="relative z-10 mt-4 text-3xl font-extrabold text-red-700"> 
                  {inactiveBooks} 
                </p> 
 
                <p className="relative z-10 mt-1 text-xs text-red-700/70"> 
                  Disabled / archived 
                </p> 
              </div> 
 
            </div> 
          </div> 
 
          {/* Usage Analytics */} 
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"> 
 
            <div className="absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-[#2563EB] to-transparent transition-transform duration-700 group-hover:scale-x-100" /> 
 
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-50 transition-transform duration-700 group-hover:scale-110" /> 
            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full border border-blue-100" /> 
 
            <div className="relative z-10 flex items-center justify-between"> 
              <div> 
                <h2 className="text-xl font-bold text-slate-800"> 
                  Usage Analytics 
                </h2> 
 
                <p className="mt-1 text-sm text-slate-500"> 
                  Digital library engagement overview 
                </p> 
              </div> 
 
              <div className="rounded-2xl bg-blue-50 p-3.5 text-[#2563EB]"> 
                <FaChartBar /> 
              </div> 
            </div> 
 
            <div className="relative z-10 mt-7 space-y-6"> 
 
              {/* Views */} 
              <div> 
                <div className="mb-2 flex items-center justify-between"> 
                  <div className="flex items-center gap-2"> 
                    <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600"> 
                      <FaEye /> 
                    </div> 
 
                    <span className="text-sm font-bold text-slate-700"> 
                      Views 
                    </span> 
                  </div> 
 
                  <span className="text-sm font-extrabold text-slate-800"> 
                    {totalViews} 
                  </span> 
                </div> 
 
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"> 
                  <div 
                    className="h-full rounded-full bg-emerald-500 transition-all duration-700" 
                    style={{ 
                      width: 
                        totalViews > 0 
                          ? `${Math.min( 
                              100, 
                              (totalViews / 
                                Math.max( 
                                  totalViews, 
                                  totalDownloads, 
                                  1 
                                )) * 
                                100 
                            )}%` 
                          : "0%", 
                    }} 
                  /> 
                </div> 
              </div> 
 
              {/* Downloads */} 
              <div> 
                <div className="mb-2 flex items-center justify-between"> 
                  <div className="flex items-center gap-2"> 
                    <div className="rounded-lg bg-violet-50 p-2 text-violet-600"> 
                      <FaDownload /> 
                    </div> 
 
                    <span className="text-sm font-bold text-slate-700"> 
                      Downloads 
                    </span> 
                  </div> 
 
                  <span className="text-sm font-extrabold text-slate-800"> 
                    {totalDownloads} 
                  </span> 
                </div> 
 
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"> 
                  <div 
                    className="h-full rounded-full bg-violet-500 transition-all duration-700" 
                    style={{ 
                      width: 
                        totalDownloads > 0 
                          ? `${Math.min( 
                              100, 
                              (totalDownloads / 
                                Math.max( 
                                  totalViews, 
                                  totalDownloads, 
                                  1 
                                )) * 
                                100 
                            )}%` 
                          : "0%", 
                    }} 
                  /> 
                </div> 
              </div> 
 
            </div> 
          </div> 
        </div> 
 
        {/* ================= CATEGORY + STATUS ================= */} 
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2"> 
 
          {/* Category Breakdown */} 
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"> 
 
            <div className="absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-[#890C25] to-transparent transition-transform duration-700 group-hover:scale-x-100" /> 
 
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#890C25]/5 transition-transform duration-700 group-hover:scale-125" /> 
 
            <div className="relative z-10 flex items-center gap-3"> 
              <div className="rounded-2xl bg-[#890C25]/10 p-3.5 text-[#890C25]"> 
                <FaBookOpen /> 
              </div> 
 
              <div> 
                <h2 className="text-xl font-bold text-slate-800"> 
                  Category Breakdown 
                </h2> 
 
                <p className="mt-1 text-sm text-slate-500"> 
                  Digital books by category 
                </p> 
              </div> 
            </div> 
 
            <div className="relative z-10 mt-6 space-y-5"> 
 
              {categoryCounts.length === 0 ? ( 
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center"> 
                  <FaBookOpen className="mx-auto text-2xl text-slate-300" /> 
 
                  <p className="mt-2 text-sm font-medium text-slate-500"> 
                    No category data available. 
                  </p> 
                </div> 
              ) : ( 
                categoryCounts.map( 
                  ([category, count]) => ( 
                    <div key={category}> 
                      <div className="mb-2 flex items-center justify-between"> 
                        <span className="text-sm font-semibold text-slate-700"> 
                          {category} 
                        </span> 
 
                        <span className="rounded-full bg-[#890C25]/10 px-2.5 py-1 text-xs font-bold text-[#890C25]"> 
                          {count} 
                        </span> 
                      </div> 
 
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"> 
                        <div 
                          className="h-full rounded-full bg-[#890C25] transition-all duration-700" 
                          style={{ 
                            width: `${ 
                              (count / 
                                maxCategoryCount) * 
                              100 
                            }%`, 
                          }} 
                        /> 
                      </div> 
                    </div> 
                  ) 
                ) 
              )} 
 
            </div> 
          </div> 
 
          {/* Status Breakdown */} 
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"> 
 
            <div className="absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-[#2563EB] to-transparent transition-transform duration-700 group-hover:scale-x-100" /> 
 
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-50 transition-transform duration-700 group-hover:scale-125" /> 
 
            <div className="relative z-10 flex items-center gap-3"> 
              <div className="rounded-2xl bg-blue-50 p-3.5 text-[#2563EB]"> 
                <FaChartBar /> 
              </div> 
 
              <div> 
                <h2 className="text-xl font-bold text-slate-800"> 
                  Status Breakdown 
                </h2> 
 
                <p className="mt-1 text-sm text-slate-500"> 
                  Digital book status distribution 
                </p> 
              </div> 
            </div> 
 
            <div className="relative z-10 mt-6 space-y-5"> 
 
              {statusCounts.length === 0 ? ( 
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center"> 
                  <FaChartBar className="mx-auto text-2xl text-slate-300" /> 
 
                  <p className="mt-2 text-sm font-medium text-slate-500"> 
                    No status data available. 
                  </p> 
                </div> 
              ) : ( 
                statusCounts.map( 
                  ([status, count]) => ( 
                    <div key={status}> 
                      <div className="mb-2 flex items-center justify-between"> 
                        <span className="text-sm font-semibold text-slate-700"> 
                          {status} 
                        </span> 
 
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#2563EB]"> 
                          {count} 
                        </span> 
                      </div> 
 
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"> 
                        <div 
                          className="h-full rounded-full bg-[#2563EB] transition-all duration-700" 
                          style={{ 
                            width: `${ 
                              (count / 
                                maxStatusCount) * 
                              100 
                            }%`, 
                          }} 
                        /> 
                      </div> 
                    </div> 
                  ) 
                ) 
              )} 
 
            </div> 
          </div> 
        </div> 
 
        {/* ================= TABLE ================= */} 
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"> 
 
          <div className="absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-[#890C25] to-transparent transition-transform duration-700 group-hover:scale-x-100" /> 
 
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#890C25]/5" /> 
 
          {/* Table Header */} 
          <div className="relative z-10 border-b border-slate-200 p-6"> 
 
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between"> 
 
              <div> 
                 
                <div className="flex items-center gap-3"> 
                     
                  <div className="rounded-xl bg-[#890C25]/10 p-3 text-[#890C25]"> 
                    <FaFileAlt /> 
                  </div> 
 
                  <div> 
                    <h2 className="text-xl font-bold text-slate-800"> 
                      Digital Books 
                    </h2> 
 
                    <p className="mt-1 text-sm text-slate-500"> 
                      Detailed digital library report 
                    </p> 
                  </div> 
                </div> 
              </div> 
 
              <div className="flex flex-col gap-3 md:flex-row"> 
 
                {/* Search */} 
                <div className="relative"> 
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /> 
 
                  <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={(e) => 
                      setSearchTerm(e.target.value) 
                    } 
                    placeholder="Search books..." 
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all duration-300 focus:border-[#890C25] focus:bg-white focus:ring-4 focus:ring-[#890C25]/10 md:w-64" 
                  /> 
                </div> 
 
                {/* Category Filter */} 
                <div className="relative"> 
                  <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /> 
 
                  <select 
                    value={categoryFilter} 
                    onChange={(e) => 
                      setCategoryFilter( 
                        e.target.value 
                      ) 
                    } 
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-9 text-sm font-medium outline-none transition-all duration-300 focus:border-[#890C25] focus:bg-white focus:ring-4 focus:ring-[#890C25]/10 md:w-52" 
                  > 
                    <option value="all"> 
                      All Categories 
                    </option> 
 
                    {categories.map( 
                      (category) => ( 
                        <option 
                          key={category} 
                          value={category.toLowerCase()} 
                        > 
                          {category} 
                        </option> 
                      ) 
                    )} 
                  </select> 
                </div> 
 
                {/* Status Filter */} 
                <select 
                  value={statusFilter} 
                  onChange={(e) => 
                    setStatusFilter(e.target.value) 
                  } 
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all duration-300 focus:border-[#890C25] focus:bg-white focus:ring-4 focus:ring-[#890C25]/10" 
                > 
                  <option value="all"> 
                    All Status 
                  </option> 
 
                  {statusCounts.map( 
                    ([status]) => ( 
                      <option 
                        key={status} 
                        value={status.toLowerCase()} 
                      > 
                        {status} 
                      </option> 
                    ) 
                  )} 
                </select> 
 
              </div> 
            </div> 
          </div> 
 
          {/* Table */} 
          <div className="relative z-10 overflow-x-auto"> 
            <table className="w-full min-w-[1050px] text-left"> 
 
              <thead> 
                <tr 
                  className="text-xs uppercase tracking-wider text-white" 
                  style={{ 
                    background: 
                      "linear-gradient(135deg, #890C25 0%, #6f091e 100%)", 
                  }} 
                > 
                  <th className="px-6 py-4 font-semibold"> 
                    # 
                  </th> 
 
                  <th className="px-6 py-4 font-semibold"> 
                    Digital Book 
                  </th> 
 
                  <th className="px-6 py-4 font-semibold"> 
                    Author 
                  </th> 
 
                  <th className="px-6 py-4 font-semibold"> 
                    Category 
                  </th> 
 
                  <th className="px-6 py-4 font-semibold"> 
                    Views 
                  </th> 
 
                  <th className="px-6 py-4 font-semibold"> 
                    Downloads 
                  </th> 
 
                  <th className="px-6 py-4 font-semibold"> 
                    Date 
                  </th> 
 
                  <th className="px-6 py-4 font-semibold"> 
                    Status 
                  </th> 
 
                  <th className="px-6 py-4 text-center font-semibold"> 
                    Action 
                  </th> 
                </tr> 
              </thead> 
 
              <tbody className="divide-y divide-slate-100"> 
 
                {loading ? ( 
                  <tr> 
                    <td 
                      colSpan="9" 
                      className="px-6 py-16 text-center" 
                    > 
                      <div className="flex flex-col items-center justify-center"> 
                        <div className="relative"> 
                          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#890C25]" /> 
                          <div className="absolute inset-2 rounded-full border border-[#890C25]/10" /> 
                        </div> 
 
                        <p className="mt-4 text-sm font-semibold text-slate-500"> 
                          Loading digital library report... 
                        </p> 
                      </div> 
                    </td> 
                  </tr> 
                ) : filteredBooks.length === 0 ? ( 
                  <tr> 
                    <td 
                      colSpan="9" 
                      className="px-6 py-16 text-center" 
                    > 
                      <div className="flex flex-col items-center justify-center"> 
 
                        <div className="rounded-2xl bg-[#890C25]/5 p-5"> 
                          <FaBookOpen className="text-3xl text-[#890C25]/40" /> 
                        </div> 
 
                        <h3 className="mt-4 text-lg font-bold text-slate-700"> 
                          No digital books found 
                        </h3> 
 
                        <p className="mt-1 text-sm text-slate-500"> 
                          Try changing your search or filters. 
                        </p> 
                      </div> 
                    </td> 
                  </tr> 
                ) : ( 
                  filteredBooks.map( 
                    (book, index) => { 
                      const status = getStatus(book); 
                      const normalized = 
                        normalizedStatus(status); 
 
                      const isActive = 
                        normalized === "active" || 
                        normalized === "published"; 
 
                      return ( 
                        <tr 
                          key={ 
                            book?._id || index 
                          } 
                          className="group/row transition-all duration-200 hover:bg-[#890C25]/[0.025]" 
                        > 
 
                          {/* Number */} 
                          <td className="px-6 py-5 text-sm font-bold text-slate-400"> 
                            {String(index + 1).padStart( 
                              2, 
                              "0" 
                            )} 
                          </td> 
 
                          {/* Book */} 
                          <td className="px-6 py-5"> 
                            <div className="flex items-center gap-3"> 
 
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25] shadow-sm transition-all duration-300 group-hover/row:scale-110 group-hover/row:shadow-md"> 
                                <FaBookOpen /> 
                              </div> 
 
                              <div className="max-w-[220px]"> 
                                <p className="truncate font-bold text-slate-800"> 
                                  {getTitle(book)} 
                                </p> 
 
                                <div className="mt-1 flex items-center gap-2 text-xs text-slate-400"> 
                                  <FaFileAlt /> 
 
                                  <span> 
                                    {getFileType( 
                                      book 
                                    )} 
                                  </span> 
                                </div> 
                              </div> 
 
                            </div> 
                          </td> 
 
                          {/* Author */} 
                          <td className="px-6 py-5"> 
                            <div className="flex items-center gap-2"> 
 
                              <div className="rounded-lg bg-blue-50 p-2 text-[#2563EB]"> 
                                <FaUser className="text-xs" /> 
                              </div> 
 
                              <span className="text-sm font-semibold text-slate-700"> 
                                {getAuthor(book)} 
                              </span> 
 
                            </div> 
                          </td> 
 
                          {/* Category */} 
                          <td className="px-6 py-5"> 
                            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600"> 
                              {getCategory(book)} 
                            </span> 
                          </td> 
 
                          {/* Views */} 
                          <td className="px-6 py-5"> 
                            <div className="flex items-center gap-2"> 
 
                              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600"> 
                                <FaEye className="text-xs" /> 
                              </div> 
 
                              <span className="font-bold text-slate-700"> 
                                {getViews(book)} 
                              </span> 
 
                            </div> 
                          </td> 
 
                          {/* Downloads */} 
                          <td className="px-6 py-5"> 
                            <div className="flex items-center gap-2"> 
 
                              <div className="rounded-lg bg-violet-50 p-2 text-violet-600"> 
                                <FaDownload className="text-xs" /> 
                              </div> 
 
                              <span className="font-bold text-slate-700"> 
                                {getDownloads( 
                                  book 
                                )} 
                              </span> 
 
                            </div> 
                          </td> 
 
                          {/* Date */} 
                          <td className="px-6 py-5"> 
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600"> 
 
                              <FaCalendarAlt className="text-slate-400" /> 
 
                              {getDate(book)} 
 
                            </div> 
                          </td> 
 
                          {/* Status */} 
                          <td className="px-6 py-5"> 
                            <span 
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${ 
                                isActive 
                                  ? "bg-green-50 text-green-700" 
                                  : "bg-red-50 text-red-700" 
                              }`} 
                            > 
                              {isActive ? ( 
                                <FaCheckCircle /> 
                              ) : ( 
                                <FaTimesCircle /> 
                              )} 
 
                              {status} 
                            </span> 
                          </td> 
 
                          {/* Action */} 
                          <td className="px-6 py-5 text-center"> 
                            <button 
                              type="button" 
                              onClick={() => 
                                handleViewBook( 
                                  book?._id 
                                ) 
                              } 
                              disabled={!book?._id} 
                              className="group/view inline-flex items-center gap-2 rounded-xl bg-[#890C25] px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#6f091e] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40" 
                            > 
                              View 
 
                              <FaArrowRight className="transition-transform duration-300 group-hover/view:translate-x-1" /> 
                            </button> 
                          </td> 
 
                        </tr> 
                      ); 
                    } 
                  ) 
                )} 
 
              </tbody> 
            </table> 
          </div> 
 
          {/* Footer */} 
          <div className="relative z-10 border-t border-slate-200 bg-slate-50 px-6 py-4"> 
 
            <div className="flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"> 
 
              <span> 
                Showing{" "} 
                <span className="font-bold text-slate-700"> 
                  {filteredBooks.length} 
                </span>{" "} 
                of{" "} 
                <span className="font-bold text-slate-700"> 
                  {digitalBooks.length} 
                </span>{" "} 
                digital books 
              </span> 
 
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400"> 
                <FaChartBar className="text-[#890C25]" /> 
                Digital Library Analytics 
              </span> 
 
            </div> 
          </div> 
 
        </div> 
 
      </div> 
    </div> 
  ); 
}; 
 
export default DigitalLibraryReport;


import { useEffect, useState } from "react";
import {
  FaCog,
  FaSave,
  FaUniversity,
  FaBook,
  FaBell,
  FaUserShield,
  FaShieldAlt,
  FaTools,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowRight,
  FaBookOpen,
  FaUndo,
  FaMoneyBillWave,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaSyncAlt,
} from "react-icons/fa";

import { useSettings } from "../../context/SettingsContext";

const defaultSettings = {
  lmsName: "",
  institutionName: "",
  email: "",
  phone: "",
  address: "",
  website: "",

  maxBooksPerStudent: 3,
  issueDurationDays: 14,
  finePerDay: 10,
  allowBookRenewal: true,
  maxRenewals: 2,

  emailNotifications: true,
  issueNotifications: true,
  returnNotifications: true,
  fineNotifications: true,
  announcementNotifications: true,

  allowStudentRegistration: true,
  allowTeacherRegistration: false,

  requireStrongPassword: true,
  sessionTimeoutMinutes: 60,

  maintenanceMode: false,
  maintenanceMessage:
    "The library system is currently under maintenance. Please try again later.",
};

const Settings = () => {
  const {
    settings,
    loading,
    updating,
    error,
    successMessage,
    updateSettings,
    clearMessages,
  } = useSettings();

  const [formData, setFormData] = useState(defaultSettings);

  useEffect(() => {
    if (settings) {
      setFormData({
        ...defaultSettings,
        ...settings,
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));

    if (error || successMessage) {
      clearMessages();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSettings(formData);
  };

  if (loading && !settings) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="text-center rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#890C25]/10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#890C25]/15 border-t-[#890C25]" />
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-800">
            Loading Library Settings
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Fetching system configuration...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-slate-100
        px-4
        pb-12
        pt-10
        sm:px-6
        sm:pt-12
        lg:px-8
        lg:pt-14
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* =================================================
            HERO HEADER
        ================================================= */}

        <div
          className="
            group/hero
            relative
            mb-6
            overflow-hidden
            rounded-3xl
            bg-[#890C25]
            shadow-2xl
          "
        >
          {/* Decorative Circles */}

          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-64
              w-64
              rounded-full
              border
              border-white/20
              bg-white/5
              transition
              duration-500
              group-hover/hero:scale-110
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              left-1/3
              h-64
              w-64
              rounded-full
              border
              border-white/10
              bg-white/5
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              right-24
              top-20
              h-20
              w-20
              rounded-full
              bg-[#D58A98]/10
              blur-2xl
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-7
              p-6
              sm:p-8
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            {/* LEFT */}

            <div>
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/20
                    bg-white/10
                    text-white
                    shadow-xl
                    backdrop-blur-md
                  "
                >
                  <FaCog size={24} className="animate-[spin_8s_linear_infinite]" />
                </div>

                <div>
                  <p
                    className="
                      text-xs
                      font-black
                      uppercase
                      tracking-[0.2em]
                      text-[#D58A98]
                    "
                  >
                    Library Management
                  </p>

                  <p className="mt-1 text-xs text-white/55">
                    Learning Management System
                  </p>
                </div>
              </div>

              <h1
                className="
                  text-3xl
                  font-extrabold
                  text-white
                  sm:text-4xl
                "
              >
                Library Management
                <span className="block text-[#D58A98]">
                  System Settings
                </span>
              </h1>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-sm
                  leading-6
                  text-white/70
                  sm:text-base
                "
              >
                Configure your library information, book circulation,
                notifications, user access and security preferences.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/15
                    bg-white/10
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-white/85
                    backdrop-blur-md
                  "
                >
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  System Configuration
                </div>

                <div
                  className="
                    rounded-full
                    border
                    border-white/15
                    bg-white/10
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-white/85
                    backdrop-blur-md
                  "
                >
                  Admin Control Panel
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/10
                  px-4
                  py-3
                  backdrop-blur-md
                "
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <FaBook className="text-[#D58A98] text-lg" />
                </div>

                <div>
                  <p className="text-xs text-white/50">
                    Configuration
                  </p>
                  <p className="text-sm font-bold text-white">
                    Library Control
                  </p>
                </div>
              </div>

              <button
                type="submit"
                form="settings-form"
                disabled={updating}
                className="
                  group/save
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  bg-white
                  px-6
                  py-4
                  text-sm
                  font-black
                  text-[#890C25]
                  shadow-xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-2xl
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {updating ? (
                  <FaSyncAlt className="animate-spin" />
                ) : (
                  <FaSave className="transition-transform group-hover/save:scale-110" />
                )}

                {updating ? "Saving..." : "Save Settings"}

                <FaArrowRight className="text-xs transition-transform group-hover/save:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* =================================================
            STATUS MESSAGES
        ================================================= */}

        {successMessage && (
          <div
            className="
              mb-6
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-green-200
              bg-green-50
              px-5
              py-4
              text-sm
              font-semibold
              text-green-700
              shadow-sm
            "
          >
            <FaCheckCircle className="text-xl shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div
            className="
              mb-6
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-red-200
              bg-red-50
              px-5
              py-4
              text-sm
              font-semibold
              text-red-700
              shadow-sm
            "
          >
            <FaExclamationCircle className="text-xl shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form
          id="settings-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* =================================================
              GENERAL INFORMATION
          ================================================= */}

          <SettingsSection
            icon={<FaUniversity />}
            number="01"
            title="Library Information"
            subtitle="Manage your library identity and contact information"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InputField
                label="Library System Name"
                name="lmsName"
                value={formData.lmsName}
                onChange={handleChange}
                placeholder="Library Management System"
                icon={<FaBookOpen />}
              />

              <InputField
                label="Library / Institution Name"
                name="institutionName"
                value={formData.institutionName}
                onChange={handleChange}
                placeholder="Enter library name"
                icon={<FaUniversity />}
              />

              <InputField
                label="Official Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="library@example.com"
                icon={<FaEnvelope />}
              />

              <InputField
                label="Contact Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0300-0000000"
                icon={<FaPhone />}
              />

              <InputField
                label="Library Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                icon={<FaGlobe />}
              />

              <TextField
                label="Library Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter complete library address"
                icon={<FaMapMarkerAlt />}
              />
            </div>
          </SettingsSection>

          {/* =================================================
              BOOK CIRCULATION
          ================================================= */}

          <SettingsSection
            icon={<FaBook />}
            number="02"
            title="Book Circulation Settings"
            subtitle="Configure book issuing, returning, renewal and fine policies"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <NumberField
                label="Maximum Books"
                description="Books allowed per student"
                name="maxBooksPerStudent"
                value={formData.maxBooksPerStudent}
                onChange={handleChange}
                min="0"
                icon={<FaBook />}
              />

              <NumberField
                label="Issue Duration"
                description="Allowed borrowing days"
                name="issueDurationDays"
                value={formData.issueDurationDays}
                onChange={handleChange}
                min="0"
                icon={<FaClock />}
              />

              <NumberField
                label="Fine Per Day"
                description="Overdue fine amount"
                name="finePerDay"
                value={formData.finePerDay}
                onChange={handleChange}
                min="0"
                icon={<FaMoneyBillWave />}
              />

              <NumberField
                label="Maximum Renewals"
                description="Renewals allowed per issue"
                name="maxRenewals"
                value={formData.maxRenewals}
                onChange={handleChange}
                min="0"
                icon={<FaSyncAlt />}
              />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <ToggleField
                label="Allow Book Renewal"
                description="Allow users to renew their issued books"
                name="allowBookRenewal"
                checked={formData.allowBookRenewal}
                onChange={handleChange}
                icon={<FaSyncAlt />}
              />
            </div>

            <div
              className="
                mt-5
                flex
                items-start
                gap-3
                rounded-2xl
                border
                border-[#890C25]/10
                bg-[#890C25]/5
                p-4
              "
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                <FaUndo />
              </div>

              <div>
                <p className="text-sm font-black text-slate-800">
                  Book Return & Fine Policy
                </p>

                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  These settings define the borrowing duration, renewal
                  limit and daily overdue fine amount. Actual issue and
                  return processing remains managed through the library
                  circulation module.
                </p>
              </div>
            </div>
          </SettingsSection>

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <SettingsSection
            icon={<FaBell />}
            number="03"
            title="Notification Preferences"
            subtitle="Control library-related notification settings"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ToggleField
                label="Email Notifications"
                description="Enable general email notifications"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleChange}
                icon={<FaEnvelope />}
              />

              <ToggleField
                label="Book Issue Notifications"
                description="Notify users when books are issued"
                name="issueNotifications"
                checked={formData.issueNotifications}
                onChange={handleChange}
                icon={<FaBookOpen />}
              />

              <ToggleField
                label="Book Return Notifications"
                description="Notify users about book returns"
                name="returnNotifications"
                checked={formData.returnNotifications}
                onChange={handleChange}
                icon={<FaUndo />}
              />

              <ToggleField
                label="Fine Notifications"
                description="Notify users about overdue fines"
                name="fineNotifications"
                checked={formData.fineNotifications}
                onChange={handleChange}
                icon={<FaMoneyBillWave />}
              />

              <ToggleField
                label="Announcement Notifications"
                description="Enable library announcement notifications"
                name="announcementNotifications"
                checked={formData.announcementNotifications}
                onChange={handleChange}
                icon={<FaBell />}
              />
            </div>
          </SettingsSection>

          {/* =================================================
              USER & REGISTRATION
          ================================================= */}

          <SettingsSection
            icon={<FaUserShield />}
            number="04"
            title="User & Registration"
            subtitle="Manage student and teacher registration permissions"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ToggleField
                label="Student Registration"
                description="Allow students to register"
                name="allowStudentRegistration"
                checked={formData.allowStudentRegistration}
                onChange={handleChange}
                icon={<FaUserShield />}
              />

              <ToggleField
                label="Teacher Registration"
                description="Allow teachers to register"
                name="allowTeacherRegistration"
                checked={formData.allowTeacherRegistration}
                onChange={handleChange}
                icon={<FaUniversity />}
              />
            </div>
          </SettingsSection>

          {/* =================================================
              SECURITY
          ================================================= */}

          <SettingsSection
            icon={<FaShieldAlt />}
            number="05"
            title="Security & Access"
            subtitle="Configure basic system security preferences"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <NumberField
                label="Session Timeout"
                description="Session duration in minutes"
                name="sessionTimeoutMinutes"
                value={formData.sessionTimeoutMinutes}
                onChange={handleChange}
                min="1"
                icon={<FaClock />}
              />

              <ToggleField
                label="Strong Password Requirement"
                description="Require stronger user passwords"
                name="requireStrongPassword"
                checked={formData.requireStrongPassword}
                onChange={handleChange}
                icon={<FaShieldAlt />}
              />
            </div>
          </SettingsSection>

          {/* =================================================
              MAINTENANCE
          ================================================= */}

          <SettingsSection
            icon={<FaTools />}
            number="06"
            title="System Maintenance"
            subtitle="Manage temporary library system maintenance"
          >
            <ToggleField
              label="Maintenance Mode"
              description="Enable maintenance mode for the library system"
              name="maintenanceMode"
              checked={formData.maintenanceMode}
              onChange={handleChange}
              icon={<FaTools />}
            />

            <div className="mt-5">
              <TextField
                label="Maintenance Message"
                name="maintenanceMessage"
                value={formData.maintenanceMessage}
                onChange={handleChange}
                placeholder="Enter maintenance message"
                rows={4}
              />
            </div>

            {formData.maintenanceMode && (
              <div
                className="
                  mt-4
                  flex
                  items-start
                  gap-3
                  rounded-2xl
                  border
                  border-amber-200
                  bg-amber-50
                  p-4
                "
              >
                <FaExclamationCircle className="mt-0.5 shrink-0 text-xl text-amber-500" />

                <div>
                  <p className="font-semibold text-amber-700">
                    Maintenance Mode Enabled
                  </p>

                  <p className="mt-1 text-sm text-amber-700/70">
                    Save your settings to submit this maintenance
                    configuration. Whether normal access is blocked depends
                    on your backend implementation.
                  </p>
                </div>
              </div>
            )}
          </SettingsSection>

          {/* =================================================
              BOTTOM SAVE
          ================================================= */}

          <div
            className="
              group/savebox
              relative
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-xl
              md:p-8
            "
          >
            <div
              className="
                absolute
                left-0
                top-0
                h-1
                w-16
                rounded-br-full
                bg-gradient-to-r
                from-[#65091c]
                via-[#890C25]
                to-[#D58A98]
                transition-all
                duration-700
                group-hover/savebox:w-full
              "
            />

            <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-800">
                  Save Library Configuration
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Review your settings before saving the changes.
                </p>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="
                  group/final
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  bg-[#890C25]
                  px-7
                  py-3.5
                  text-sm
                  font-black
                  text-white
                  shadow-lg
                  shadow-[#890C25]/20
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#73091f]
                  hover:shadow-xl
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {updating ? (
                  <FaSyncAlt className="animate-spin" />
                ) : (
                  <FaSave className="transition-transform group-hover/final:scale-110" />
                )}

                {updating ? "Saving Settings..." : "Save All Settings"}

                <FaArrowRight className="text-xs transition-transform group-hover/final:translate-x-1" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ========================================
   SETTINGS SECTION
======================================== */

const SettingsSection = ({
  icon,
  number,
  title,
  subtitle,
  children,
}) => {
  return (
    <section
      className="
        group/section
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-xl
        transition-all
        duration-300
        hover:shadow-2xl
      "
    >
      <div
        className="
          absolute
          left-0
          top-0
          h-1
          w-16
          rounded-br-full
          bg-gradient-to-r
          from-[#65091c]
          via-[#890C25]
          to-[#D58A98]
          transition-all
          duration-700
          group-hover/section:w-full
        "
      />

      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#890C25]/5 pointer-events-none" />
      <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-blue-500/5 pointer-events-none" />

      <div className="relative">
        <div className="mb-7 flex items-center gap-4">
          <div
            className="
              relative
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-[#890C25]/10
              text-xl
              text-[#890C25]
              shadow-sm
              transition-all
              duration-300
              group-hover/section:bg-[#890C25]
              group-hover/section:text-white
            "
          >
            {icon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black tracking-[0.18em] text-[#890C25]/70">
                SECTION {number}
              </span>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
                Configuration
              </span>
            </div>

            <h2 className="mt-1 text-lg font-black text-slate-800 md:text-xl">
              {title}
            </h2>

            <p className="mt-1 text-xs text-slate-500 md:text-sm">
              {subtitle}
            </p>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
};

/* ========================================
   INPUT FIELD
======================================== */

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
}) => {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            py-3.5
            pr-4
            text-sm
            font-medium
            text-slate-700
            placeholder-slate-400
            outline-none
            transition-all
            duration-300
            focus:border-[#890C25]/40
            focus:bg-white
            focus:ring-4
            focus:ring-[#890C25]/10
            ${icon ? "pl-11" : "px-4"}
          `}
        />
      </div>
    </div>
  );
};

/* ========================================
   NUMBER FIELD
======================================== */

const NumberField = ({
  label,
  description,
  name,
  value,
  onChange,
  min,
  icon,
}) => {
  return (
    <div
      className="
        group/number
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-slate-50
        p-4
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-[#890C25]/20
        hover:bg-white
        hover:shadow-lg
      "
    >
      <div
        className="
          absolute
          left-0
          top-0
          h-1
          w-12
          rounded-br-full
          bg-[#890C25]
          transition-all
          duration-500
          group-hover/number:w-full
        "
      />

      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-black text-slate-800">
            {label}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 outline-none transition focus:border-[#890C25]/40 focus:ring-4 focus:ring-[#890C25]/10"
      />
    </div>
  );
};

/* ========================================
   TEXTAREA FIELD
======================================== */

const TextField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  icon,
}) => {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-4 text-slate-400">
            {icon}
          </span>
        )}

        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          className={`
            w-full
            resize-y
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3.5
            text-sm
            font-medium
            text-slate-700
            placeholder-slate-400
            outline-none
            transition-all
            duration-300
            focus:border-[#890C25]/40
            focus:bg-white
            focus:ring-4
            focus:ring-[#890C25]/10
            ${icon ? "pl-11" : ""}
          `}
        />
      </div>
    </div>
  );
};

/* ========================================
   TOGGLE FIELD
======================================== */

const ToggleField = ({
  label,
  description,
  name,
  checked,
  onChange,
  icon,
}) => {
  return (
    <label
      className="
        group/toggle
        relative
        flex
        cursor-pointer
        items-center
        justify-between
        gap-4
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        px-4
        py-4
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-[#890C25]/20
        hover:shadow-lg
      "
    >
      <div
        className="
          absolute
          left-0
          top-0
          h-1
          w-12
          rounded-br-full
          bg-[#890C25]
          transition-all
          duration-500
          group-hover/toggle:w-full
        "
      />

      <div className="relative flex min-w-0 items-center gap-3">
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
            {icon}
          </div>
        )}

        <div className="min-w-0">
          <p className="text-sm font-black text-slate-800">
            {label}
          </p>

          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="relative shrink-0">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />

        <div className="h-6 w-12 rounded-full bg-slate-300 transition-all duration-300 peer-checked:bg-[#890C25]" />

        <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 peer-checked:translate-x-6" />
      </div>
    </label>
  );
};

export default Settings;

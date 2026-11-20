import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

// ==========================================
// CONTEXT PROVIDERS
// ==========================================

import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { CourseProvider } from "./context/CourseContext";
import { DepartmentProvider } from "./context/DepartmentContext";
import { BookProvider } from "./context/BookContext";
import { RequestProvider } from "./context/RequestContext";
import { IssueBookProvider } from "./context/IssueBookContext";
import { ReturnBookProvider } from "./context/ReturnBookContext";
import { FineProvider } from "./context/FineContext";
import { NotificationProvider } from "./context/NotificationContext";
import { FeedbackProvider } from "./context/FeedbackContext";
import { ReviewProvider } from "./context/ReviewContext";
import { DigitalBookProvider} from "./context/DigitalBookContext";
import { DigitalBookActivityProvider } from "./context/DigitalBookActivityContext";
import { ReportProvider } from "./context/ReportContext";
import {
  SettingsProvider,
} from "./context/SettingsContext";
// ==========================================
// CSS
// ==========================================

import "./index.css";

// ==========================================
// ROOT
// ==========================================

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    {/* ======================================
        AUTH
    ====================================== */}

    <AuthProvider>

      {/* ======================================
          USERS
      ====================================== */}

      <UserProvider>

        {/* ======================================
            COURSES
        ====================================== */}

        <CourseProvider>

          {/* ======================================
              DEPARTMENTS
          ====================================== */}

          <DepartmentProvider>

            {/* ======================================
                BOOKS
            ====================================== */}

            <BookProvider>

              {/* ======================================
                  BOOK REQUESTS
              ====================================== */}

              <RequestProvider>

                {/* ======================================
                    ISSUE BOOKS
                ====================================== */}

                <IssueBookProvider>

                  {/* ======================================
                      RETURN BOOKS
                  ====================================== */}

                  <ReturnBookProvider>

                    {/* ======================================
                        FINES
                    ====================================== */}

                    <FineProvider>

                      {/* ======================================
                          NOTIFICATIONS
                      ====================================== */}

       <NotificationProvider>
              <FeedbackProvider>
                        
                    <ReviewProvider>

                    <DigitalBookProvider>
                               <DigitalBookActivityProvider>
                                <ReportProvider>
  <SettingsProvider>
  <App />
</SettingsProvider>
</ReportProvider>
                               
                                </DigitalBookActivityProvider>                                        
                      
                
                   </DigitalBookProvider>

                   </ReviewProvider>

                   </FeedbackProvider>

                      </NotificationProvider>

                    </FineProvider>

                  </ReturnBookProvider>

                </IssueBookProvider>

              </RequestProvider>

            </BookProvider>

          </DepartmentProvider>

        </CourseProvider>

      </UserProvider>

    </AuthProvider>

  </React.StrictMode>
);
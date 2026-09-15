'use client';
import {useRouter} from "next/navigation";
import React, { useState, ChangeEvent, FormEvent } from 'react';

export interface PersonalDetailsFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  yearsOfExperience: string;
  collegeName: string;
  branch: string;
  cgpa: string;
}

export default function PersonalDetailsPage() {
  const [formData, setFormData] = useState<PersonalDetailsFormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    city: '',
    yearsOfExperience: '',
    collegeName: '',
    branch: '',
    cgpa: '',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
const router=useRouter();
  const totalFields = 8;

  const filledFields = Object.values(formData).filter(
    (value) => value.trim() !== ''
  ).length;

  const progressPercent = Math.round(
    (filledFields / totalFields) * 100
  );

  const remainingFields = totalFields - filledFields;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const triggerToast = (message: string) => {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('Submitted Personal Details:', formData);

    // Save details locally
    localStorage.setItem(
      'personalDetails',
      JSON.stringify(formData)
    );

    triggerToast('Personal details saved successfully!');
    router.push("/dashboard");
  };

  const handleSaveDraft = () => {
    console.log('Draft Saved:', formData);

    localStorage.setItem(
      'personalDetailsDraft',
      JSON.stringify(formData)
    );

    triggerToast('Draft saved to your account!');
  };

  return (
    <div className="pd-page-wrapper">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        .pd-page-wrapper {
          background: linear-gradient(
            135deg,
            #FFFBEB 0%,
            #FEF3C7 50%,
            #FDE68A 100%
          );
          min-height: 100vh;
          color: #3D2B1F;
          font-family: 'Plus Jakarta Sans',
            -apple-system,
            BlinkMacSystemFont,
            sans-serif;
          display: flex;
          flex-direction: column;
          -webkit-font-smoothing: antialiased;
        }

        .pd-top-nav {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 24px;
          padding: 20px 40px;
          width: 100%;
        }

        .pd-top-nav a {
          color: #7A6150;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .pd-top-nav a:hover {
          color: #3D2B1F;
        }

        .pd-top-nav a.active-link {
          color: #3D2B1F;
          font-weight: 600;
        }

        .pd-container {
          flex: 1;
          display: flex;
          max-width: 1320px;
          width: 100%;
          margin: 0 auto;
          padding: 20px 40px 60px;
          gap: 60px;
          align-items: center;
        }

        .pd-hero-section {
          flex: 1;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 10px;
        }

        .pd-completion-card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(232, 217, 200, 0.9);
          border-radius: 24px;
          padding: 28px 30px;
          box-shadow: 0 12px 30px -10px rgba(166, 123, 91, 0.18);
          margin-bottom: 24px;
        }

        .pd-completion-header {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .pd-progress-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.3s ease;
        }

        .pd-progress-circle-inner {
          width: 46px;
          height: 46px;
          background: #FEF3C7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 700;
          color: #3D2B1F;
        }

        .pd-completion-title-group h3 {
          font-size: 1.35rem;
          font-weight: 700;
          color: #3D2B1F;
          margin: 0 0 4px;
        }

        .pd-completion-title-group p {
          font-size: 0.88rem;
          color: #7A6150;
          font-weight: 500;
          margin: 0;
        }

        .pd-brand-description {
          font-size: 1rem;
          line-height: 1.6;
          color: #7A6150;
          margin-bottom: 28px;
        }

        .pd-benefits-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .pd-benefit-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.92rem;
          font-weight: 600;
          color: #3D2B1F;
          background: rgba(255, 255, 255, 0.4);
          padding: 10px 16px;
          border-radius: 16px;
          border: 1px solid rgba(232, 217, 200, 0.5);
        }

        .pd-form-wrapper {
          flex: 1.1;
          max-width: 580px;
          display: flex;
          justify-content: center;
        }

        .pd-form-card {
          background: #FFFBF5;
          border: 1px solid #E8D9C8;
          border-radius: 24px;
          box-shadow: 0 20px 40px -15px rgba(166, 123, 91, 0.15);
          padding: 36px 40px;
          width: 100%;
        }

        .pd-section-badge {
          display: inline-block;
          background: #F1E2D0;
          color: #8C6345;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 9999px;
          margin-bottom: 12px;
        }

        .pd-form-header {
          margin-bottom: 28px;
        }

        .pd-form-title {
          font-size: 1.45rem;
          font-weight: 700;
          color: #3D2B1F;
          margin: 0 0 6px;
        }

        .pd-form-subtitle {
          font-size: 0.88rem;
          color: #7A6150;
          margin: 0;
        }

        .pd-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px 16px;
        }

        .pd-form-group {
          display: flex;
          flex-direction: column;
        }

        .pd-full-width {
          grid-column: span 2;
        }

        .pd-form-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #3D2B1F;
          margin-bottom: 6px;
        }

        .pd-required {
          color: #B91C1C;
        }

        .pd-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .pd-input-icon {
          position: absolute;
          left: 14px;
          color: #9E8573;
          width: 18px;
          height: 18px;
          pointer-events: none;
        }

        .pd-form-input,
        .pd-form-select {
          width: 100%;
          background: #F8EFE4;
          border: 1px solid #E2D2BF;
          border-radius: 14px;
          padding: 12px 14px 12px 42px;
          font-size: 0.9rem;
          color: #3D2B1F;
          outline: none;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .pd-form-select {
          appearance: none;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23A67B5B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }

        .pd-form-input::placeholder {
          color: #9E8573;
          font-size: 0.88rem;
        }

        .pd-form-input:focus,
        .pd-form-select:focus {
          border-color: #A67B5B;
          box-shadow: 0 0 0 3px rgba(166, 123, 91, 0.2);
          background: #FFFFFF;
        }

        .pd-form-actions {
          margin-top: 30px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pd-btn-primary {
          width: 100%;
          background: #A67B5B;
          color: #FFFFFF;
          border: none;
          border-radius: 14px;
          padding: 14px 24px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(166, 123, 91, 0.35);
          transition: all 0.2s ease;
        }

        .pd-btn-primary:hover {
          background: #8F6647;
          transform: translateY(-1px);
        }

        .pd-btn-primary:active {
          background: #785338;
          transform: translateY(0);
        }

        .pd-btn-secondary {
          width: 100%;
          background: transparent;
          color: #7A6150;
          border: 1px solid #E2D2BF;
          border-radius: 14px;
          padding: 12px 24px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pd-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.6);
          color: #3D2B1F;
        }

        .pd-footer-note {
          text-align: center;
          margin-top: 16px;
          font-size: 0.8rem;
          color: #9E8573;
        }

        .pd-toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #A67B5B;
          color: #FFFFFF;
          padding: 14px 20px;
          border-radius: 14px;
          box-shadow: 0 10px 25px rgba(166, 123, 91, 0.35);
          font-size: 0.88rem;
          z-index: 1000;
          animation: slideInUp 0.3s ease;
        }

        @keyframes slideInUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }

          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (max-width: 992px) {
          .pd-container {
            flex-direction: column;
            padding: 10px 20px 40px;
            gap: 30px;
          }

          .pd-hero-section {
            max-width: 100%;
            align-items: center;
            padding-left: 0;
          }

          .pd-form-wrapper {
            width: 100%;
            max-width: 540px;
          }
        }

        @media (max-width: 600px) {
          .pd-top-nav {
            padding: 16px 20px;
            gap: 14px;
          }

          .pd-form-card {
            padding: 24px 20px;
          }

          .pd-form-grid {
            grid-template-columns: 1fr;
          }

          .pd-full-width {
            grid-column: span 1;
          }

          .pd-toast {
            left: 20px;
            right: 20px;
            bottom: 20px;
          }
        }
      `}</style>

      {/* Navigation */}
      <header className="pd-top-nav">
        <a href="#" className="active-link">
          Profile Setup
        </a>

        <a href="#">
          Help
        </a>

        <a href="#">
          Sign out
        </a>
      </header>

      {/* Main */}
      <main className="pd-container">

        {/* LEFT SIDE */}
        <section className="pd-hero-section">

          <div className="pd-completion-card">
            <div className="pd-completion-header">

              <div
                className="pd-progress-circle"
                style={{
                  background: `conic-gradient(
                    #A67B5B ${progressPercent}%,
                    #F1E2D0 0
                  )`,
                }}
              >
                <div className="pd-progress-circle-inner">
                  {progressPercent}%
                </div>
              </div>

              <div className="pd-completion-title-group">
                <h3>
                  Profile Completion
                </h3>

                <p>
                  {remainingFields === 0
                    ? 'All details filled! Ready to submit.'
                    : `${remainingFields} field(s) remaining`}
                </p>
              </div>

            </div>
          </div>

          <p className="pd-brand-description">
            Complete your personal details to personalize job
            recommendations, match with alumni networks, and surface
            the skills that match each role.
          </p>

          <div className="pd-benefits-list">

            <div className="pd-benefit-item">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A67B5B"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>

              <span>
                Personalized job matches & recommendations
              </span>
            </div>

            <div className="pd-benefit-item">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A67B5B"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>

              <span>
                Direct alumni & recruiter connections
              </span>
            </div>

            <div className="pd-benefit-item">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A67B5B"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>

              <span>
                Tailored skill gap analysis
              </span>
            </div>

          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="pd-form-wrapper">

          <div className="pd-form-card">

            <div className="pd-form-header">

              <span className="pd-section-badge">
                Personal Details
              </span>

              <h2 className="pd-form-title">
                Enter your details
              </h2>

              <p className="pd-form-subtitle">
                Provide accurate information to personalize your
                recommendations.
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="pd-form-grid">

                {/* FULL NAME */}
                <div className="pd-form-group pd-full-width">

                  <label
                    className="pd-form-label"
                    htmlFor="fullName"
                  >
                    Full Name <span className="pd-required">*</span>
                  </label>

                  <div className="pd-input-wrapper">

                    <svg
                      className="pd-input-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>

                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="pd-form-input"
                      placeholder="e.g. Alex Morgan"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />

                  </div>
                </div>

                {/* EMAIL */}
                <div className="pd-form-group">

                  <label
                    className="pd-form-label"
                    htmlFor="email"
                  >
                    Email Address <span className="pd-required">*</span>
                  </label>

                  <div className="pd-input-wrapper">

                    <svg
                      className="pd-input-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>

                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="pd-form-input"
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />

                  </div>
                </div>

                {/* PHONE */}
                <div className="pd-form-group">

                  <label
                    className="pd-form-label"
                    htmlFor="phoneNumber"
                  >
                    Phone Number <span className="pd-required">*</span>
                  </label>

                  <div className="pd-input-wrapper">

                    <svg
                      className="pd-input-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>

                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      className="pd-form-input"
                      placeholder="+91 9876543210"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />

                  </div>
                </div>

                {/* CITY */}
                <div className="pd-form-group">

                  <label
                    className="pd-form-label"
                    htmlFor="city"
                  >
                    City <span className="pd-required">*</span>
                  </label>

                  <div className="pd-input-wrapper">

                    <svg
                      className="pd-input-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>

                    <input
                      type="text"
                      id="city"
                      name="city"
                      className="pd-form-input"
                      placeholder="e.g. Pune"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />

                  </div>
                </div>

                {/* EXPERIENCE */}
                <div className="pd-form-group">

                  <label
                    className="pd-form-label"
                    htmlFor="yearsOfExperience"
                  >
                    Years of Experience{' '}
                    <span className="pd-required">*</span>
                  </label>

                  <div className="pd-input-wrapper">

                    <svg
                      className="pd-input-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="2"
                        y="7"
                        width="20"
                        height="14"
                        rx="2"
                      />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>

                    <select
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      className="pd-form-select"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select experience
                      </option>

                      <option value="0">
                        0 years (Fresher)
                      </option>

                      <option value="1">
                        1 year
                      </option>

                      <option value="2">
                        2 years
                      </option>

                      <option value="3">
                        3 years
                      </option>

                      <option value="4">
                        4 years
                      </option>

                      <option value="5+">
                        5+ years
                      </option>
                    </select>

                  </div>
                </div>

                {/* COLLEGE */}
                <div className="pd-form-group">

                  <label
                    className="pd-form-label"
                    htmlFor="collegeName"
                  >
                    College Name{' '}
                    <span className="pd-required">*</span>
                  </label>

                  <div className="pd-input-wrapper">

                    <svg
                      className="pd-input-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 10l9-5 9 5" />
                      <path d="M5 10v8" />
                      <path d="M9 10v8" />
                      <path d="M15 10v8" />
                      <path d="M19 10v8" />
                      <path d="M3 18h18" />
                    </svg>

                    <input
                      type="text"
                      id="collegeName"
                      name="collegeName"
                      className="pd-form-input"
                      placeholder="Enter your college name"
                      value={formData.collegeName}
                      onChange={handleChange}
                      required
                    />

                  </div>
                </div>

                {/* BRANCH */}
                <div className="pd-form-group">

                  <label
                    className="pd-form-label"
                    htmlFor="branch"
                  >
                    Branch <span className="pd-required">*</span>
                  </label>

                  <div className="pd-input-wrapper">

                    <svg
                      className="pd-input-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2v20" />
                      <path d="M2 12h20" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>

                    <select
                      id="branch"
                      name="branch"
                      className="pd-form-select"
                      value={formData.branch}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select branch
                      </option>

                      <option value="Computer Science">
                        Computer Science
                      </option>

                      <option value="Information Technology">
                        Information Technology
                      </option>

                      <option value="AI & Data Science">
                        AI & Data Science
                      </option>

                      <option value="Artificial Intelligence">
                        Artificial Intelligence
                      </option>

                      <option value="Electronics & Telecommunication">
                        Electronics & Telecommunication
                      </option>

                      <option value="Mechanical Engineering">
                        Mechanical Engineering
                      </option>

                      <option value="Civil Engineering">
                        Civil Engineering
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>

                  </div>
                </div>

                {/* CGPA */}
                <div className="pd-form-group">

                  <label
                    className="pd-form-label"
                    htmlFor="cgpa"
                  >
                    CGPA <span className="pd-required">*</span>
                  </label>

                  <div className="pd-input-wrapper">

                    <svg
                      className="pd-input-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
                    </svg>

                    <input
                      type="number"
                      id="cgpa"
                      name="cgpa"
                      className="pd-form-input"
                      placeholder="e.g. 8.5"
                      value={formData.cgpa}
                      onChange={handleChange}
                      min="0"
                      max="10"
                      step="0.01"
                      required
                    />

                  </div>
                </div>

              </div>

              {/* BUTTONS */}
              <div className="pd-form-actions">

                <button
                  type="submit"
                  className="pd-btn-primary"
                >
                  Save Personal Details
                </button>

                <button
                  type="button"
                  className="pd-btn-secondary"
                  onClick={handleSaveDraft}
                >
                  Save as Draft
                </button>

              </div>

              <p className="pd-footer-note">
                Your information is used only to personalize your
                placement experience.
              </p>

            </form>

          </div>

        </section>

      </main>

      {/* TOAST */}
      {toastMessage && (
        <div className="pd-toast">
          {toastMessage}
        </div>
      )}

    </div>
  );
}
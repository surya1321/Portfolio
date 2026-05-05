import React, { useState } from "react";
import { profile } from "../mock";
import { Mail, MapPin, Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { submitContact } from "../lib/api";

const MAX_MESSAGE_LEN = 500;

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [networkErr, setNetworkErr] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "message" && value.length > MAX_MESSAGE_LEN) return;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
    if (success) setSuccess(false);
    if (networkErr) setNetworkErr("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your full name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "That email doesn’t look right.";
    if (!form.message.trim()) e.message = "Please write a short message.";
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    setSubmitting(true);
    setNetworkErr("");
    try {
      await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;
      if (status === 422 && Array.isArray(detail)) {
        const fieldErrs = {};
        detail.forEach((d) => {
          const field = (d.loc || []).slice(-1)[0];
          if (field) fieldErrs[field] = d.msg || "Invalid value";
        });
        setErrors(fieldErrs);
      } else {
        setNetworkErr("Couldn’t send your message right now. Please try again or email me directly.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (hasErr) =>
    `bg-transparent border-b outline-none py-2 text-[15px] text-[var(--fg)] placeholder:text-[var(--muted)] transition-colors ${
      hasErr ? "" : "border-[var(--line)] focus:border-[var(--fg)]"
    }`;
  const errBorder = { borderColor: "var(--error)" };

  return (
    <section id="contact" className="section-pad surface divider-top">
      <div className="container-wide">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-5">
            <div className="t-subheading mb-4">07 / Contact</div>
            <h2 className="t-display mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}>
              <span className="block reveal-line"><span>Let’s build</span></span>
              <span className="block reveal-line"><span><span className="italic-accent font-normal">something</span></span></span>
              <span className="block reveal-line"><span>worth shipping.</span></span>
            </h2>
            <p className="t-body text-[var(--muted)] mb-7" style={{ maxWidth: "42ch" }}>
              I’m open to full-time roles, internships, and short-term builds in data science, software engineering, and ERP.
            </p>

            <div className="flex flex-col gap-3.5">
              <a href={`mailto:${profile.email}`} className="link-underline inline-flex items-center gap-3 w-fit" data-cursor="hover" aria-label="Send email">
                <Mail size={15} /> <span>{profile.email}</span>
              </a>
              <div className="inline-flex items-center gap-3 w-fit text-[var(--muted)]">
                <MapPin size={15} /> <span>{profile.location}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-5 border border-[var(--line)] p-7 lg:p-9 surface-2"
              noValidate
              aria-label="Contact form"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Full name</label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-err" : undefined}
                    className={fieldClass(!!errors.name)}
                    style={errors.name ? errBorder : undefined}
                    placeholder="e.g. Meruva Surya Tej"
                  />
                  {errors.name && <span id="name-err" className="text-[12px]" style={{ color: "var(--error)" }}>{errors.name}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-err" : undefined}
                    className={fieldClass(!!errors.email)}
                    style={errors.email ? errBorder : undefined}
                    placeholder="you@domain.com"
                  />
                  {errors.email && <span id="email-err" className="text-[12px]" style={{ color: "var(--error)" }}>{errors.email}</span>}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="message" className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Message</label>
                  <span className="font-mono text-[10.5px] text-[var(--muted)]" aria-live="polite">{form.message.length}/{MAX_MESSAGE_LEN}</span>
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  rows={5}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-err" : undefined}
                  className={`${fieldClass(!!errors.message)} resize-none`}
                  style={errors.message ? errBorder : undefined}
                  placeholder="Briefly, what are you working on?"
                />
                {errors.message && <span id="message-err" className="text-[12px]" style={{ color: "var(--error)" }}>{errors.message}</span>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center"
                data-cursor="hover"
                aria-label="Send message"
              >
                {submitting ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : <><Send size={15} /> Send message</>}
              </button>

              {success && (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-2 text-[13.5px]"
                  style={{ color: "var(--beacon)" }}
                >
                  <CheckCircle2 size={15} /> Message sent! I’ll reply within 24h.
                </div>
              )}
              {networkErr && (
                <div
                  role="alert"
                  className="flex items-center gap-2 text-[13.5px]"
                  style={{ color: "var(--error)" }}
                >
                  <AlertCircle size={15} /> {networkErr}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

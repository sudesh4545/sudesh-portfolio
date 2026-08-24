import { AlertCircle, ArrowUpRight, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { contactChannels, contactCopy, contactEndpoint, personal, socials } from '../data/portfolio';
import { accent as accentMap } from '../lib/accents';
import { cn } from '../lib/cn';
import { GlassCard } from './GlassCard';
import { Icon } from './Icon';
import { NeonButton } from './NeonButton';
import { Reveal } from './Reveal';
import { Section } from './Section';
import { SectionHeading } from './SectionHeading';
import { useToast } from './Toast';

/* -------------------------------------------------------------------------- */
/*  Validation + sanitising                                                   */
/* -------------------------------------------------------------------------- */

const LIMITS = { name: 80, email: 120, subject: 120, message: 2000 } as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

type FieldName = 'name' | 'email' | 'subject' | 'message';
type FormValues = Record<FieldName, string>;
type FormErrors = Partial<Record<FieldName, string>>;

/** Strips control characters, trims, and hard-caps the length. */
function sanitize(value: string, max: number, allowNewlines = false): string {
  const cleaned = value
    .split('')
    .filter((char) => {
      const code = char.charCodeAt(0);
      if (allowNewlines && (char === '\n' || char === '\t')) return true;
      return code > 31 && code !== 127;
    })
    .join('');
  return cleaned.slice(0, max);
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  const name = values.name.trim();
  if (name.length < 2) errors.name = 'Please enter at least 2 characters.';

  const email = values.email.trim();
  if (!email) errors.email = 'An email address is required.';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'That does not look like a valid email address.';

  const subject = values.subject.trim();
  if (subject.length < 3) errors.subject = 'Please add a short subject (3+ characters).';

  const message = values.message.trim();
  if (message.length < 10) errors.message = 'Tell me a little more — at least 10 characters.';

  return errors;
}

const EMPTY: FormValues = { name: '', email: '', subject: '', message: '' };

/* -------------------------------------------------------------------------- */
/*  Field primitives                                                          */
/* -------------------------------------------------------------------------- */

const fieldClasses =
  'w-full rounded-xl border bg-[#060d16]/80 px-3.5 py-3 font-sans text-[0.9rem] text-paper placeholder:text-faint/70 transition-colors duration-200 focus:outline-none';

function Field({
  id,
  label,
  error,
  children,
  hint,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="font-display text-[0.6rem] font-semibold tracking-[0.2em] text-muted uppercase"
        >
          {label}
        </label>
        {hint && <span className="text-[0.62rem] tabular-nums text-faint">{hint}</span>}
      </div>
      <div className="mt-2">{children}</div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-[0.72rem] text-[#f0abfc]"
        >
          <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export function Contact() {
  const { push } = useToast();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const honeypot = useRef('');
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const isConfigured = contactEndpoint.trim().length > 0;

  const update = (field: FieldName, raw: string) => {
    const value = sanitize(raw, LIMITS[field], field === 'message');
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    if (sent) setSent(false);
  };

  /** mailto: fallback with the message pre-filled — always honest, always works. */
  const mailtoHref = () => {
    const subject = values.subject.trim() || 'Portfolio enquiry';
    const body = `${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`;
    return `mailto:${personal.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      push({
        title: 'Please check the form',
        description: 'A few fields still need your attention.',
        variant: 'error',
      });
      return;
    }

    // Silent bot trap — a real visitor never fills this hidden input.
    if (honeypot.current.trim().length > 0) return;

    if (!isConfigured) {
      push({
        title: 'Opening your email app',
        description: `Your message is ready to send to ${personal.email}.`,
        variant: 'info',
      });
      window.location.href = mailtoHref();
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
        }),
      });

      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

      if (!mounted.current) return;
      setValues(EMPTY);
      setSent(true);
      push({
        title: 'Message sent',
        description: 'Thanks for reaching out — I will reply as soon as I can.',
        variant: 'success',
      });
    } catch (error) {
      if (!mounted.current) return;
      push({
        title: 'Message could not be sent',
        description:
          error instanceof Error
            ? `${error.message}. You can email me directly instead.`
            : 'Something went wrong. You can email me directly instead.',
        variant: 'error',
      });
    } finally {
      if (mounted.current) setSubmitting(false);
    }
  };

  return (
    <Section id="contact" labelledBy="contact-heading">
      <SectionHeading
        id="contact-heading"
        eyebrow="Contact"
        title={contactCopy.heading}
        subtitle={contactCopy.subheading}
      />

      <div className="mt-14 grid grid-cols-1 gap-6 lg:mt-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
        {/* ---------------------------- Left: channels ---------------------------- */}
        <div className="flex flex-col gap-4">
          <Reveal>
            <GlassCard variant="panel" radiusClass="rounded-3xl">
              <div className="p-6 sm:p-7">
                <h3 className="font-display text-[1.05rem] font-semibold text-paper">Contact me</h3>
                <p className="mt-2.5 text-[0.85rem] leading-relaxed text-muted">
                  I am open to internships, collaborations and practical software projects. Email is the fastest
                  way to reach me, or you can call using the number below.
                </p>

                <ul className="mt-6 space-y-3">
                  {contactChannels.map((channel) => {
                    const tone = accentMap[channel.accent];
                    const body = (
                      <>
                        <span
                          className={cn(
                            'inline-flex size-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110',
                            tone.chip,
                          )}
                        >
                          <Icon name={channel.icon} className="size-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display text-[0.55rem] font-semibold tracking-[0.2em] text-faint uppercase">
                            {channel.label}
                          </span>
                          <span className="mt-0.5 block truncate text-[0.85rem] font-medium text-paper/90">
                            {channel.value}
                          </span>
                        </span>
                      </>
                    );

                    return (
                      <li key={channel.id}>
                        {channel.href ? (
                          <a
                            href={channel.href}
                            className="group glass-well flex items-center gap-3.5 rounded-xl p-3 transition-colors hover:border-brand-cyan/35"
                          >
                            {body}
                            <ArrowUpRight
                              aria-hidden="true"
                              className="ml-auto size-4 shrink-0 text-faint transition-colors group-hover:text-brand-cyan"
                            />
                          </a>
                        ) : (
                          <div className="group glass-well flex items-center gap-3.5 rounded-xl p-3">{body}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {/* Socials */}
                <div className="mt-6 border-t border-white/[0.07] pt-5">
                  <p className="font-display text-[0.55rem] font-semibold tracking-[0.2em] text-faint uppercase">
                    Elsewhere
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2.5">
                    {socials.map((social) => (
                      <li key={social.id}>
                        {social.url ? (
                          <a
                            href={social.url}
                            {...(social.id === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                            aria-label={social.label}
                            className="glass inline-flex size-11 items-center justify-center rounded-xl text-muted transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
                          >
                            <Icon name={social.icon} className="size-4" />
                          </a>
                        ) : (
                          <span
                            title={`${social.label} URL not configured — add it in src/data/portfolio.ts`}
                            className="inline-flex size-11 cursor-not-allowed items-center justify-center rounded-xl border border-dashed border-white/12 text-faint"
                          >
                            <Icon name={social.icon} className="size-4" />
                            <span className="sr-only">{social.label} — link not configured yet</span>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass-well flex items-center gap-3 rounded-2xl p-4">
              <span className="relative flex size-2.5 shrink-0">
                <span className="anim-pulse-ring absolute inline-flex size-full rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
              </span>
              <p className="font-display text-[0.68rem] font-semibold tracking-[0.16em] text-emerald-100/90 uppercase">
                {personal.availability}
              </p>
            </div>
          </Reveal>
        </div>

        {/* ------------------------------ Right: form ----------------------------- */}
        <Reveal delay={0.12}>
          <GlassCard variant="panel" radiusClass="rounded-3xl">
            <form noValidate onSubmit={onSubmit} className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-[1.05rem] font-semibold text-paper">Write an email</h3>
                <span
                  className={cn(
                    'rounded-full border px-2.5 py-0.5 font-display text-[0.5rem] font-semibold tracking-[0.2em] uppercase',
                    isConfigured
                      ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
                      : 'border-dashed border-white/15 text-faint',
                  )}
                >
                  {isConfigured ? 'Direct sending enabled' : 'Uses your email app'}
                </span>
              </div>

              {!isConfigured && (
                <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-3.5 text-[0.75rem] leading-relaxed text-muted">
                  Fill in your details below. Clicking the button will open your email app with the message already
                  addressed to {personal.name}—review it there and press Send.
                </p>
              )}

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field id="contact-name" label="Your name" error={errors.name}>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={LIMITS.name}
                    value={values.name}
                    onChange={(event) => update('name', event.target.value)}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    placeholder="Ada Lovelace"
                    className={cn(
                      fieldClasses,
                      errors.name ? 'border-brand-magenta/50' : 'border-white/10 focus:border-brand-cyan/60',
                    )}
                  />
                </Field>

                <Field id="contact-email" label="Email" error={errors.email}>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    maxLength={LIMITS.email}
                    value={values.email}
                    onChange={(event) => update('email', event.target.value)}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    placeholder="you@example.com"
                    className={cn(
                      fieldClasses,
                      errors.email ? 'border-brand-magenta/50' : 'border-white/10 focus:border-brand-cyan/60',
                    )}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field id="contact-subject" label="Subject" error={errors.subject}>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      maxLength={LIMITS.subject}
                      value={values.subject}
                      onChange={(event) => update('subject', event.target.value)}
                      aria-invalid={errors.subject ? true : undefined}
                      aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                      placeholder="Internship opportunity"
                      className={cn(
                        fieldClasses,
                        errors.subject ? 'border-brand-magenta/50' : 'border-white/10 focus:border-brand-cyan/60',
                      )}
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field
                    id="contact-message"
                    label="Message"
                    error={errors.message}
                    hint={`${values.message.length}/${LIMITS.message}`}
                  >
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      maxLength={LIMITS.message}
                      value={values.message}
                      onChange={(event) => update('message', event.target.value)}
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                      placeholder="Tell me about the role, project or idea…"
                      className={cn(
                        fieldClasses,
                        'resize-y',
                        errors.message ? 'border-brand-magenta/50' : 'border-white/10 focus:border-brand-cyan/60',
                      )}
                    />
                  </Field>
                </div>
              </div>

              {/* Honeypot — hidden from people, irresistible to bots */}
              <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="contact-company">Company (leave empty)</label>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(event) => {
                    honeypot.current = event.target.value;
                  }}
                />
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <NeonButton
                  type="submit"
                  size="lg"
                  loading={submitting}
                  iconRight={submitting ? undefined : <Send aria-hidden="true" className="size-4" />}
                >
                  {submitting ? 'Sending…' : isConfigured ? 'Send message' : 'Open email & send'}
                </NeonButton>

                <a
                  href={`mailto:${personal.email}`}
                  className="inline-flex min-h-11 items-center px-1 font-display text-[0.68rem] font-semibold tracking-[0.16em] text-muted uppercase transition-colors hover:text-brand-cyan"
                >
                  or email directly
                </a>
              </div>

              {sent && (
                <p
                  role="status"
                  className="mt-5 rounded-xl border border-brand-cyan/30 bg-brand-cyan/[0.07] p-3.5 text-[0.78rem] text-paper/90"
                >
                  Your message was delivered to the configured endpoint. Thanks for reaching out.
                </p>
              )}
            </form>
          </GlassCard>
        </Reveal>
      </div>
    </Section>
  );
}

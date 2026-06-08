"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MaskedInput } from "@/components/admin/MaskedInput";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  testMongoUri,
  saveMongoConfig,
  testCloudinaryConfig,
  saveCloudinaryConfig,
  testSmtpConfig,
  saveSmtpConfig,
  saveStudioInfo,
} from "@/actions/config.actions";

const STEPS = ["MongoDB", "Cloudinary", "Email", "Studio Info"];

export function SetupWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [pending, setPending] = useState(false);

  const [mongoUri, setMongoUri] = useState("");
  const [mongoStatus, setMongoStatus] = useState<"idle" | "ok" | "fail">("idle");

  const [cloudName, setCloudName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [cloudStatus, setCloudStatus] = useState<"idle" | "ok" | "fail">("idle");

  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "ok" | "fail">("idle");

  const [studioName, setStudioName] = useState("Ali Studio");
  const [tagline, setTagline] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  const testMongo = async () => {
    setPending(true);
    const result = await testMongoUri(mongoUri);
    setPending(false);
    setMongoStatus(result.success ? "ok" : "fail");
    if (!result.success) toast.error(result.error ?? "Connection failed");
    else toast.success("MongoDB connected");
  };

  const saveMongo = async () => {
    setPending(true);
    const result = await saveMongoConfig(mongoUri);
    setPending(false);
    if (result.success) {
      toast.success("MongoDB saved");
      setStep(1);
    } else toast.error(result.error ?? "Failed to save");
  };

  const testCloud = async () => {
    setPending(true);
    const result = await testCloudinaryConfig({ cloudName, apiKey, apiSecret });
    setPending(false);
    setCloudStatus(result.success ? "ok" : "fail");
    if (!result.success) toast.error(result.error ?? "Invalid credentials");
    else toast.success("Cloudinary valid");
  };

  const saveCloud = async () => {
    setPending(true);
    const result = await saveCloudinaryConfig({ cloudName, apiKey, apiSecret });
    setPending(false);
    if (result.success) {
      toast.success("Cloudinary saved");
      setStep(2);
    } else toast.error(result.error ?? "Failed to save");
  };

  const testEmail = async () => {
    setPending(true);
    const result = await testSmtpConfig({ user: smtpUser, pass: smtpPass });
    setPending(false);
    setEmailStatus(result.success ? "ok" : "fail");
    if (!result.success) toast.error(result.error ?? "Failed to send");
    else toast.success("Test email sent");
  };

  const saveEmail = async () => {
    setPending(true);
    const result = await saveSmtpConfig({ user: smtpUser, pass: smtpPass });
    setPending(false);
    if (result.success) {
      toast.success("Email config saved");
      setStep(3);
    } else toast.error(result.error ?? "Failed to save");
  };

  const finishSetup = async () => {
    setPending(true);
    const result = await saveStudioInfo({
      studioName,
      tagline,
      phone,
      whatsappNumber: whatsapp,
      email,
    });
    setPending(false);
    if (result.success) {
      toast.success("Setup complete!");
      router.push("/admin/dashboard");
      router.refresh();
    } else toast.error(result.error ?? "Failed to save");
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-8 flex gap-2">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded ${i <= step ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`}
          />
        ))}
      </div>

      <h2 className="font-display text-2xl text-[var(--accent)]">
        Step {step + 1}: {STEPS[step]}
      </h2>

      {step === 0 && (
        <div className="mt-6 space-y-4">
          <div>
            <Label>MongoDB Connection URI</Label>
            <MaskedInput value={mongoUri} onChange={(e) => setMongoUri(e.target.value)} className="mt-1" />
            {mongoStatus === "ok" && <p className="text-xs text-green-400 mt-1">✅ Connected</p>}
            {mongoStatus === "fail" && <p className="text-xs text-red-400 mt-1">❌ Failed</p>}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={testMongo} disabled={pending}>
              Test Connection
            </Button>
            <Button type="button" onClick={saveMongo} disabled={pending || !mongoUri}>
              Save & Continue
            </Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="mt-6 space-y-4">
          <div>
            <Label>Cloud Name</Label>
            <Input value={cloudName} onChange={(e) => setCloudName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>API Key</Label>
            <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>API Secret</Label>
            <MaskedInput value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} className="mt-1" />
            {cloudStatus === "ok" && <p className="text-xs text-green-400 mt-1">✅ Valid</p>}
            {cloudStatus === "fail" && <p className="text-xs text-red-400 mt-1">❌ Invalid</p>}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={testCloud} disabled={pending}>
              Test Connection
            </Button>
            <Button type="button" onClick={saveCloud} disabled={pending}>
              Save & Continue
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 space-y-4">
          <div>
            <Label>Gmail Address</Label>
            <Input value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>App Password</Label>
            <MaskedInput value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} className="mt-1" />
            {emailStatus === "ok" && <p className="text-xs text-green-400 mt-1">✅ Sent</p>}
            {emailStatus === "fail" && <p className="text-xs text-red-400 mt-1">❌ Failed</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={testEmail} disabled={pending}>
              Send Test Email
            </Button>
            <Button type="button" onClick={saveEmail} disabled={pending}>
              Save & Continue
            </Button>
            <Button type="button" variant="ghost" onClick={() => setStep(3)}>
              Skip
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-6 space-y-4">
          <div>
            <Label>Studio Name</Label>
            <Input value={studioName} onChange={(e) => setStudioName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>WhatsApp Number</Label>
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
          </div>
          <Button type="button" onClick={finishSetup} disabled={pending}>
            Complete Setup
          </Button>
        </div>
      )}
    </div>
  );
}

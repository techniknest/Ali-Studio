"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MaskedInput } from "@/components/admin/MaskedInput";
import { toast } from "sonner";
import {
  testMongoUri,
  saveMongoConfig,
  testCloudinaryConfig,
  saveCloudinaryConfig,
  testSmtpConfig,
  saveSmtpConfig,
} from "@/actions/config.actions";

interface InfrastructureSettingsProps {
  masked: Record<string, { masked: string; hasValue: boolean }>;
  status: { mongoStatus: boolean; cloudinaryStatus: boolean; emailStatus: boolean };
}

export function InfrastructureSettings({ masked, status }: InfrastructureSettingsProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [mongoUri, setMongoUri] = useState("");
  const [cloudName, setCloudName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-200">
        Keep your ENCRYPTION_KEY safe. Losing it means losing access to all saved credentials.
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>🗄️ MongoDB</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setEditing(editing === "mongo" ? null : "mongo")}>
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-sm">{masked.MONGODB_URI?.masked}</p>
          <p className="mt-2 text-xs">Status: {status.mongoStatus ? "✅ Connected" : "❌ Not connected"}</p>
          {editing === "mongo" && (
            <div className="mt-4 space-y-2">
              <Label>URI</Label>
              <MaskedInput value={mongoUri} onChange={(e) => setMongoUri(e.target.value)} />
              <Button
                disabled={pending}
                onClick={async () => {
                  setPending(true);
                  const test = await testMongoUri(mongoUri);
                  if (!test.success) {
                    setPending(false);
                    toast.error(test.error);
                    return;
                  }
                  const save = await saveMongoConfig(mongoUri);
                  setPending(false);
                  if (save.success) toast.success("Saved");
                  else toast.error(save.error);
                }}
              >
                Test & Save
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>☁️ Cloudinary</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setEditing(editing === "cloud" ? null : "cloud")}>
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-sm">Cloud: {masked.CLOUDINARY_CLOUD_NAME?.masked}</p>
          <p className="font-mono text-sm">Key: {masked.CLOUDINARY_API_KEY?.masked}</p>
          <p className="mt-2 text-xs">Status: {status.cloudinaryStatus ? "✅ Valid" : "❌ Invalid"}</p>
          {editing === "cloud" && (
            <div className="mt-4 space-y-2">
              <Input placeholder="Cloud name" value={cloudName} onChange={(e) => setCloudName(e.target.value)} />
              <Input placeholder="API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              <MaskedInput placeholder="API Secret" value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} />
              <Button
                disabled={pending}
                onClick={async () => {
                  setPending(true);
                  const test = await testCloudinaryConfig({ cloudName, apiKey, apiSecret });
                  if (!test.success) {
                    setPending(false);
                    toast.error(test.error);
                    return;
                  }
                  const save = await saveCloudinaryConfig({ cloudName, apiKey, apiSecret });
                  setPending(false);
                  if (save.success) toast.success("Saved");
                  else toast.error(save.error);
                }}
              >
                Test & Save
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>📧 SMTP Email (Gmail)</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setEditing(editing === "smtp" ? null : "smtp")}>
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-sm">User: {masked.SMTP_USER?.masked}</p>
          <p className="mt-2 text-xs">Status: {status.emailStatus ? "✅ Active" : "⚠️ Not configured"}</p>
          {editing === "smtp" && (
            <div className="mt-4 space-y-2">
              <Input value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} placeholder="Gmail Address" />
              <MaskedInput value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} placeholder="App Password" />
              <Button
                disabled={pending}
                onClick={async () => {
                  setPending(true);
                  const test = await testSmtpConfig({ user: smtpUser, pass: smtpPass });
                  if (!test.success) {
                    setPending(false);
                    toast.error(test.error);
                    return;
                  }
                  const save = await saveSmtpConfig({ user: smtpUser, pass: smtpPass });
                  setPending(false);
                  if (save.success) toast.success("Saved");
                  else toast.error(save.error);
                }}
              >
                Test & Save
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

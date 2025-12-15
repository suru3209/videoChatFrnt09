"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL + "/api/v1/users" ||
  "http://localhost:8080/api/v1/users";

type Profile = {
  name: string;
  username: string;
  email: string;
  gender: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    username: "",
    email: "",
    gender: "",
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data);
    };

    fetchProfile();
  }, []);

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    if (!profile.name.trim()) return "Name is required";
    if (!profile.username.trim()) return "Username is required";
    if (!/^\S+@\S+\.\S+$/.test(profile.email)) return "Invalid email format";

    if (password) {
      if (password.length < 8) return "Password must be at least 8 characters";
      if (password !== confirmPassword) return "Passwords do not match";
    }

    return null;
  };

  /* ---------------- UPDATE PROFILE ---------------- */
  const handleUpdate = async () => {
    const error = validate();
    if (error) return alert(error);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/update`,
        {
          ...profile,
          password: password || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditMode(false);
      setPassword("");
      setConfirmPassword("");
    } catch {
      console.log("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="pt-25 pb-4 bg-[#fafdef]  md:h-screen  lg:h-screen  flex justify-center px-4">
      <Card className="w-full max-w-xl bg-[#1e3b4b]/60">
        <CardHeader className="flex flex-col items-center gap-4">
          <Avatar className="h-28 w-28">
            <AvatarImage src="" />
            <AvatarFallback className="text-3xl">
              {profile.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <CardTitle>My Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* NAME */}
          <div>
            <Label className="p-2">Name</Label>
            <Input
              disabled={!editMode}
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          {/* USERNAME */}
          <div>
            <Label className="p-2">Username</Label>
            <Input disabled value={profile.username} />
          </div>

          {/* EMAIL */}
          <div>
            <Label className="p-2">Email</Label>
            <Input
              disabled={!editMode}
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          </div>

          {/* GENDER */}
          <div>
            <Label className="p-2">Gender</Label>
            <Select
              disabled={!editMode}
              value={profile.gender}
              onValueChange={(value) =>
                setProfile({ ...profile, gender: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* PASSWORD */}
          {editMode && (
            <>
              <div>
                <Label className="p-2">New Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <Label className="p-2">Confirm Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            {!editMode ? (
              <Button
                className="bg-[#c2f84f] text-black hover:text-white"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-[#c2f84f] text-black hover:text-white"
                  onClick={handleUpdate}
                  disabled={loading}
                >
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

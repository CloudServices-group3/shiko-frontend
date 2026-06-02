"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FormLabel } from "@/components/profile/FormLabel";
import FormInput from "@/components/profile/FormInput";
import FormTextarea from "@/components/profile/FormTextarea";
import { profileService, type Profile } from "@/services/profile-service";

// Dana - Skills & Achievements
import SkillsSection from "@/components/profile/SkillsSection";
import AchievementsSection from "@/components/profile/AchievementsSection";

export default function Profile() {
  const DEMO_USER_ID = "11111111-1111-1111-1111-111111111111";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    description: "",
    profileImageUrl: "",
  });

  // const [profilePasseword, setProfilePassword] = useState({
  //   currentPassword: "",
  //   newPassWord: "",
  //   newPasswordConfirm: "",
  // })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSaving(true);
      await profileService.updateProfile(profile);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "tab1", label: "General" },
    // { id: "tab2", label: "Settings" },
  ] as const;

  type TabId = (typeof tabs)[number]["id"];
  const [activeTab, setActiveTab] = useState<TabId>("tab1");

  const tabContent = {
    tab1: (
      <div>
        {/* Tabcontent Profile - Left section */}
        <div className="grid gap-6 grid-cols-[450px_1fr]">
          <div className="rounded-xl bg-white p-3 ">
            <Image
              src="/images/profile/profile-cover.png"
              alt="Profile Placeholder"
              width={430}
              height={180}
              className="w-full"
            />
            <div className="justify-center items-center flex flex-col gap-4 -mt-13 mb-6">
              <div className="w-25 h-25 "></div>
              {/* rounded-full bg-eee overflow-hidden border-2 border-fff shadow-sm */}
              <h2 className="text-h2 font-semibold text-center">
                {profile.firstName} {profile.lastName}
              </h2>
            </div>

            <div>
              <h2 className="figma-title font-semibold pl-4">Bio</h2>
              <div className="bg-bg rounded-xl p-7 m-4">
                <p className="text-aaa text-b2/6">{profile.description}</p>
              </div>
            </div>

            <div className="px-4 mt-4">
              <SkillsSection userId={DEMO_USER_ID} />
            </div>

            <div className="px-4 mt-6">
              <AchievementsSection userId={DEMO_USER_ID} />
            </div>
          </div>

          {/* Tabcontent Profile - Right section */}
          <div className="rounded-xl bg-white pt-12 pl-8 pr-8 pb-12">
            {success && (
              <p className="text-green-600 text-sm mb-4">
                Profile updated successfully.
              </p>
            )}

            {/* Upload profileimage */}
            <form className="space-y-8" noValidate onSubmit={handleSubmit}>
              <div className="mb-2">
                <FormLabel htmlFor="firstName" required>
                  First Name
                </FormLabel>
              </div>
              <FormInput
                id="firstName"
                type="text"
                placeholder="First name"
                value={profile.firstName}
                onChange={(e) =>
                  setProfile({ ...profile, firstName: e.target.value })
                }
              />

              <div className="mb-2">
                <FormLabel htmlFor="lastName" required>
                  Last Name
                </FormLabel>
              </div>
              <FormInput
                id="lastName"
                type="text"
                required
                placeholder="Last name"
                value={profile.lastName}
                onChange={(e) =>
                  setProfile({ ...profile, lastName: e.target.value })
                }
              />

              <div className="mb-2">
                <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
              </div>
              <FormInput
                id="phoneNumber"
                type="text"
                placeholder="Enter phone number"
                value={profile.phoneNumber}
                onChange={(e) =>
                  setProfile({ ...profile, phoneNumber: e.target.value })
                }
              />

              <div className="mb-2">
                <FormLabel htmlFor="description">Description</FormLabel>
              </div>
              <FormTextarea
                id="description"
                placeholder="Enter a description"
                value={profile.description}
                onChange={(e) =>
                  setProfile({ ...profile, description: e.target.value })
                }
              />

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-p2 px-10 py-3 text-fff transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving || loading}
              >
                {saving ? "Saving.." : "Save"}
              </button>
            </form>
          </div>
        </div>
      </div>
    ),
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="w-full">
      <h1 className="text-h1 font-semibold">Profile</h1>

      <div className="w-full flex">
        <div className="w-full rounded-3xl space-y-5">
          <div className="flex flex-wrap gap-4 mt-6 mb-8">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                className={`px-6 py-4 text-b1 ${
                  activeTab === tab.id
                    ? "bg-p1 rounded-lg text-white"
                    : "text-aaa hover:text-p2 cursor-pointer"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div>{tabContent[activeTab]}</div>
        </div>
      </div>
    </section>
  );
}
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FormLabel } from "@/components/profile/FormLabel";
import  FormInput from "@/components/profile/FormInput";
import FormTextarea from "@/components/profile/FormTextarea";

export default function Profile()  {
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [success, setSuccess] = useState(false);

const [profile, setProfile] = useState({
  firstName: "",
  lastName: "",
  phoneNumber: "",
  description: "",
  profileImage: "",
})

// const [profilePasseword, setProfilePassword] = useState({
//   currentPassword: "",
//   newPassWord: "",
//   newPasswordConfirm: "",
// })

  const fetchProfile = async (jwt: string) =>{
      try{
        const response = await fetch("https://shiko-profile-provider-api-2.azurewebsites.net/api/profiles/me",
          {
            headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type" : "application/json",
          },
        }); 
        
      if(response.status === 401)
        {
          sessionStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }  

      if (!response.ok) {
        console.log("GET STATUS:", response.status);
        const text = await response.text();
        throw new Error("text");
        // throw new Error("Failed to fetch profile");
      }
      const data = await response.json();

      setProfile({
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        phoneNumber: data.phoneNumber ?? "",
        description: data.description ?? "",
        profileImage: data.profileImage ?? "",
      });       
    }
      
      catch(error){
        console.error("Error fetching profile", error);
      }
      finally{
        setLoading(false);
      }
    };

   // EFFECT: Get token and username from session storage
    useEffect(() => {
      const jwt = sessionStorage.getItem("token");
      if (!jwt) 
        {
          setLoading(false);
          window.location.replace("/sign-in");
          return;
        }      

      fetchProfile(jwt);

    }, []);    

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {e.preventDefault();
  const jwt = sessionStorage.getItem("token");

  if(!jwt)
    return;

    try {
    setSaving(true);

    const response = await fetch("https://shiko-profile-provider-api-2.azurewebsites.net/api/profiles/",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(profile),
      }
    );

    if (!response.ok) {
        console.log("PUT STATUS:", response.status);
        const text = await response.text();
        console.log("PUT BODY:", text)
        
        throw new Error("text");
        // throw new Error("Failed to fetch profile");
      }

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
    {id: "tab1", label: "General"},
    {id: "tab2", label: "Settings"},
  ] as const;

  type TabId = (typeof tabs)[number]["id"];

  const [activeTab, setActiveTab] = useState<TabId>("tab1");

  const tabContent = {

    tab1: (
      <div>
        {/* Tabcontent Profile - Left section */}               
        <div className="grid gap-6 grid-cols-[450px_1fr]">          
          <div className="rounded-xl bg-white p-3 "> 
            <Image src="/images/profile/profile-cover.png" alt="Profile Placeholder" width={430} height={180} className="w-full" /> 
            <div className="justify-center items-center flex flex-col gap-4 -mt-13 mb-6">
              <div className="w-25 h-25 rounded-full bg-eee overflow-hidden border-2 border-fff shadow-sm"></div>
              <h2 className="text-h2 font-semibold text-center">{profile.firstName} {profile.lastName}</h2>
            </div>
            <div>
              <h2 className="figma-title font-semibold pl-4">Bio</h2>
              <div className="bg-bg rounded-xl p-7 m-4">
                <p className="text-aaa text-b2/6">{profile.description}</p>
              </div>
            </div>
          </div>
          {/* Tabcontent Profile - Right section */}
          <div className="rounded-xl bg-white pt-12 pl-8 pr-8 pb-12"> 
            {success && <p className="text-green-600 text-sm mb-4">Profile updated successfully.</p>}
            <form className="space-y-8" noValidate onSubmit={handleSubmit}> 
              {/* Upload profileimage */}
              <div className="mb-2">
                <FormLabel htmlFor="firstName" required>First Name</FormLabel>                
              </div>
              <FormInput id="firstName" type="text" placeholder="First name" value={profile.firstName} onChange={(e) => setProfile({...profile,firstName: e.target.value,})} />

              <div className="mb-2">
                <FormLabel htmlFor="lastName" required>Last Name</FormLabel>
              </div>
              <FormInput id="lastName" type="text" required placeholder="Last name" value={profile.lastName} onChange={(e) => setProfile({...profile,lastName: e.target.value,})} /> 

              <div className="mb-2">
                <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
              </div>
              <FormInput id="phoneNumber" type="text" placeholder="Enter phone number" value={profile.phoneNumber} onChange={(e) => setProfile({...profile,phoneNumber: e.target.value,})}/>

              <div className="mb-2"> 
                <FormLabel htmlFor="description">Description</FormLabel>
              </div>               
              <FormTextarea id="description" placeholder="Enter a description" value={profile.description} onChange={(e) => setProfile({...profile,description: e.target.value,})} />
              
              <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-p2 px-10 py-3 text-fff transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed" disabled={saving || loading} >{saving? "Saving.." : "Save"}</button>

            </form>
          </div>          
        </div>
      </div>
    ),

    tab2: (
      <div>
        {/* Tabcontent Settings - Left section */}              
        <div className="grid gap-6 grid-cols-[450px_1fr] mb-6">
          <div className="p-4">            
            <h3 className="text-title font-semibold">Password</h3>
            <p className="text-aaa">Please enter your current password to change your password.</p>
          </div>
          {/* Tabcontent Settings - Right section */}
          <div className="rounded-xl bg-white pt-12 pl-8 pr-8 pb-12"> 
            <h3 className="text-title font-semibold">Password</h3>
            <p className="text-b2 text-aaa pb-8 pt-2">Change password. Verification code will be sent to your email address.</p>
            <form className="space-y-8"> 
              <div className="mb-2">
                <FormLabel htmlFor="currrentPassword" required>Current password</FormLabel>
              </div>
              {/* <FormInput id="currentPassword" type="password" placeholder="Current password"  /> */}

              <div className="mb-2">
                <FormLabel htmlFor="newPassword" required>New password</FormLabel>
              </div>
              <div>
                {/* <FormInput id="newPassword" type="password" required placeholder="New password" /> */}
                <span className="text-aaa">Your new password must be more than 10 characters long.</span>
              </div>

              <div className="mb-2">
                <FormLabel htmlFor="confirmNewPassword" required >Confirm new password</FormLabel>
              </div>
              {/* <FormInput id="confirmNewPassword" type="password" placeholder="Confirm new password" /> */}
              
              <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-p2 px-10 py-3 text-fff transition hover:opacity-90 cursor-pointer">Save</button>
            </form>
          </div>          
        </div>
        {/* Tabcontent Settings - Remove Account */}
        <div className="grid gap-6 grid-cols-[450px_1fr]">
          {/* Tabcontent Settings - Left section */}
          <div className="p-4">            
            <h3 className="text-title font-semibold">Remove Account</h3>
            <p className="text-aaa">Delete account and personal information.</p>
          </div>
          {/* Tabcontent Settings - Right section */}
          <div className="rounded-xl bg-white p-8"> 
            <form className="">             
              <button type="submit" className="inline-flex items-center gap-2 rounded-xl border border-p2 px-10 py-3 text-p2 transition hover:opacity-90 cursor-pointer">Remove Account</button>
            </form>
          </div>          
        </div>
      </div>
    ),

  }
  if (loading){
    return <div>Loading...</div>
  }

  return  <section className="w-full">
    <h1 className="text-h1 font-semibold">Profile</h1>
    {/* Tabmenu */}
    <>
    {/* Background */}
    <div className="w-full flex">
    {/* Tabsection */}
    <div className="w-full rounded-3xl space-y-5">
      <div className="flex flex-wrap gap-4 mt-6 mb-8">
        {/* Tabs */}
        {tabs.map((tab) => (
          <button 
            type="button"
            key={tab.id} 
            className={`px-6 py-4 text-b1 ${activeTab === tab.id ? "bg-p1 rounded-lg text-white" : "text-aaa hover:text-p2 cursor-pointer"}`} 
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>))}
      </div>
      <div>
        {/* Tab Content */}
        {tabContent[activeTab]}
      </div>
    </div>
    </div>
    </>
  </section>;
}
import { useEffect, useState } from "react";
import Icon from "../../components/common/Icon";
import StorePageLayout from "../../components/common/StorePageLayout";
import FavoriteGameShowcase from "../../components/profile/FavoriteGameShowcase";
import AccountProfileHero from "../../components/profile/AccountProfileHero";
import { games } from "../../data/store";
import { getProfile, updateProfile } from "../../api/profileApi";
import useAuthSession from "../../hooks/useAuthSession";
import "./ProfilePage.css";
import { useAppStore } from "../../stores/appStore";

export default function ProfilePage({ onNavigate }) {
  const [user, signOut] = useAuthSession();
  const userId = user?._id;
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [profile, setProfile] = useState(null);
  const [profileUserId, setProfileUserId] = useState(null);
  const profileLoading = Boolean(userId && profileUserId !== userId);
  const [profileSaving, setProfileSaving] = useState(false);
  const wishlistCount = useAppStore((state) => state.wishlist.length);
  const wishlistGames = useAppStore((state) => state.wishlistGames);
  const updateUser = useAppStore((state) => state.updateUser);
  const favoriteGame = wishlistGames[0] || games[0];

  const onAction = (action) => setNotice(action);

  useEffect(() => {
    let active = true;
    if (!userId) return () => { active = false; };
    getProfile()
      .then((data) => { if (active) { setProfile(data); setProfileUserId(userId); } })
      .catch((error) => { if (active) { setNotice(error.message || "Could not load your profile."); setProfileUserId(userId); } });
    return () => { active = false; };
  }, [userId]);

  const saveProfile = async (updates) => {
    setProfileSaving(true);
    try {
      const updated = await updateProfile(updates);
      setProfile(updated);
      updateUser({ name: updated.name, profilePhoto: updated.profilePhoto || "" });
      setNotice("Profile saved.");
      return true;
    } catch (error) {
      setNotice(error.message || "Could not save your profile.");
      return false;
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <StorePageLayout
      query={query}
      onSearch={setQuery}
      onAction={onAction}
      wishlistCount={wishlistCount}
      user={user}
      onNavigate={onNavigate}
      onSignOut={signOut}
    >
      <main className="profile-page container">
        {user ? (
          <>
            {notice && <div className="profile-notice" role="status">{notice}<button type="button" aria-label="Dismiss" onClick={() => setNotice("")}>×</button></div>}
            {profileLoading ? <p className="profile-loading" role="status">Loading your profile…</p> : profile ? <>
              <AccountProfileHero profile={profile} user={user} onSave={saveProfile} saving={profileSaving} />
              <div className="profile-layout profile-layout-single">
                <FavoriteGameShowcase game={favoriteGame} onNavigate={onNavigate} />
              </div>
            </> : <p className="profile-loading" role="alert">Your profile could not be loaded. {notice}</p>}
          </>
        ) : (
          <section className="profile-login-prompt">
            <Icon name="profile" size={30} />
            <h1>Sign in to view your profile</h1>
            <p>Your profile, achievements, and activity are available after signing in.</p>
            <button type="button" onClick={() => onNavigate("/login")}>Sign in</button>
          </section>
        )}
      </main>
    </StorePageLayout>
  );
}

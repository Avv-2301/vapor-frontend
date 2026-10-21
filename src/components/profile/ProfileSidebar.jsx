import { useState } from "react";
import { profileComments, profileFriends } from "../../data/profile";
import Icon from "../common/Icon";

function ProfileFriends({ onAction }) {
  return (
    <section className="profile-panel profile-friends">
      <div className="profile-panel-heading"><div><h2>Friends <small>(128)</small></h2></div><span><i />14 online</span></div>
      <div className="profile-friend-list">
        {profileFriends.map((friend, index) => (
          <article key={friend.name}>
            <div className={`profile-friend-avatar avatar-${index}`}>{friend.name.slice(0, 2).toUpperCase()}<i className={friend.online ? "online" : "away"} /></div>
            <span><strong>{friend.name}</strong><small className={friend.online ? "online" : ""}>{friend.state}</small></span>
            <button type="button" aria-label={`Message ${friend.name}`} onClick={() => onAction(`Message ${friend.name}`)}><Icon name="chat" size={14} /></button>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProfileComments({ ownerName, onAction }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(profileComments);

  const submitComment = (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    setComments([{ author: "You", age: "Just now", message: comment.trim() }, ...comments]);
    setComment("");
    onAction("Comment added to this local preview.");
  };

  return (
    <section className="profile-panel profile-comments">
      <div className="profile-panel-heading"><div><h2>Comments</h2></div><span>18 total</span></div>
      <form onSubmit={submitComment}><label className="sr-only" htmlFor="profile-comment">Write a profile comment</label><input id="profile-comment" value={comment} maxLength={240} onChange={(event) => setComment(event.target.value)} placeholder={`Write on ${ownerName}’s profile…`} /><button type="submit" aria-label="Post comment"><Icon name="send" size={15} /></button></form>
      <div className="profile-comment-list">
        {comments.map((entry, index) => <article key={`${entry.author}-${entry.age}-${index}`}><div><strong>{entry.author}</strong><span>· {entry.age}</span><button type="button" aria-label={`Report comment by ${entry.author}`} onClick={() => onAction("Report comment")}><Icon name="flag" size={12} /></button></div><p>{entry.message}</p></article>)}
      </div>
    </section>
  );
}

export default function ProfileSidebar({ userName, onAction }) {
  return (
    <aside className="profile-sidebar">
      <ProfileFriends onAction={onAction} />
      <ProfileComments ownerName={userName} onAction={onAction} />
    </aside>
  );
}

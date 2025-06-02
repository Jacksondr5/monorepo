"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import type { Project } from "../../server/zod/project";
import type { ZodUser } from "../../server/zod/user";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
} from "@j5/component-library";
import { ThumbsUp } from "lucide-react";

interface ProjectCommentsProps {
  comments: Project["comments"];
  currentUser: ZodUser;
  getInitials: (firstName?: string, lastName?: string) => string;
  projectId: Id<"projects">;
  userMap: Map<string, ZodUser>;
}

export function ProjectComments({
  comments,
  currentUser,
  getInitials,
  projectId,
  userMap,
}: ProjectCommentsProps) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");

  const addComment = useMutation(api.projects.addCommentToProject);
  const upvoteCommentMutation = useMutation(api.projects.upvoteComment);
  const removeUpvoteFromCommentMutation = useMutation(
    api.projects.removeUpvoteFromComment,
  );

  const handleAddComment = async () => {
    if (newCommentText.trim() === "" || !currentUser) return;
    try {
      await addComment({
        projectId,
        text: newCommentText.trim(),
      });
      setNewCommentText("");
      setShowCommentForm(false);
    } catch (error) {
      console.error("Failed to add comment:", error);
      // TODO: Better error display
    }
  };

  const handleUpvoteComment = async (commentId: string) => {
    if (!currentUser) return;
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;

    const hasUpvoted = comment.upvotes.some(
      (upvote) => upvote.userId === currentUser._id,
    );

    try {
      if (hasUpvoted) {
        await removeUpvoteFromCommentMutation({
          projectId,
          commentId,
        });
      } else {
        await upvoteCommentMutation({
          projectId,
          commentId,
        });
      }
    } catch (error) {
      console.error("Failed to update comment upvote:", error);
      // TODO: Better error display
    }
  };

  return (
    <div className="mt-4">
      {/* Display Comments List */}
      {comments.length > 0 && (
        <div className="border-slate-6 border-t pt-4">
          <h4 className="text-slate-12 mb-2 text-sm font-semibold">Comments</h4>
          <ul className="space-y-3">
            {comments.map((comment) => {
              const commentAuthor = userMap.get(comment.authorId);
              const commentAuthorName = commentAuthor
                ? `${commentAuthor.firstName} ${commentAuthor.lastName}`.trim() ||
                  "Anonymous"
                : "Unknown User";
              const userHasUpvoted = currentUser
                ? comment.upvotes.some(
                    (upvote) => upvote.userId === currentUser._id,
                  )
                : false;

              return (
                <li key={comment.id} className="text-slate-11 text-xs">
                  <div className="flex items-start gap-2">
                    <Avatar className="mt-0.5 h-5 w-5">
                      {commentAuthor?.avatarUrl && (
                        <AvatarImage
                          src={commentAuthor.avatarUrl}
                          alt={commentAuthorName}
                        />
                      )}
                      <AvatarFallback className="text-xxs">
                        {getInitials(
                          commentAuthor?.firstName,
                          commentAuthor?.lastName,
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-slate-12 font-semibold">
                        {commentAuthorName}
                      </span>
                      <span className="text-slate-9 text-xxs ml-2">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                      <p className="mt-0.5">{comment.text}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-10 hover:text-grass-9 h-auto p-1 disabled:opacity-50"
                          onClick={() => handleUpvoteComment(comment.id)}
                          disabled={!currentUser}
                        >
                          <ThumbsUp
                            className={`h-4 w-4 ${
                              userHasUpvoted
                                ? "fill-grass-9 text-grass-9"
                                : "text-slate-10"
                            }`}
                          />
                        </Button>
                        <span className="text-slate-9 text-xs">
                          {comment.upvotes.length}{" "}
                          {comment.upvotes.length === 1 ? "upvote" : "upvotes"}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Add Comment Section */}
      {currentUser && (
        <div className="border-slate-6 mt-4 border-t pt-2">
          {showCommentForm ? (
            <div className="space-y-2">
              <textarea
                className="border-slate-7 bg-slate-3 text-slate-12 focus:ring-grass-9 focus:border-grass-9 w-full rounded-md border p-2 text-sm"
                rows={3}
                placeholder="Write a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCommentForm(false);
                    setNewCommentText("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAddComment}
                  disabled={newCommentText.trim() === ""}
                >
                  Submit Comment
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCommentForm(true)}
            >
              Add Comment
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

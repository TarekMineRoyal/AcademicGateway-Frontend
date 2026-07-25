import { MessageSquare, Send, Loader2 } from 'lucide-react';

/**
 * DiscussionFeed
 * Isolates messaging feed history, bottom-ref scrolling, and comment submission form.
 */
export default function DiscussionFeed({
  comments = [],
  loadingComments = false,
  project,
  getAuthorName,
  getAuthorIdentity,
  formatCommentTime,
  commentInput = '',
  setCommentInput,
  handleKeyDown,
  handleSendMessage,
  isPostingComment = false,
  chatEndRef,
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Message History */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 min-h-[340px] max-h-[340px]">
        {loadingComments ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
            <Loader2 className="w-7 h-7 animate-spin text-neutral-300 mb-2" />
            <p className="text-xs">Loading correspondence history...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-400">
            <MessageSquare className="w-8 h-8 text-neutral-300 mb-2" />
            <p className="text-xs font-semibold">No activity logs yet</p>
            <p className="text-[11px] max-w-xs mt-1 px-4 text-neutral-400">
              Be the first to leave a status update, ask a question, or contact the supervisors.
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const isStudent = 
              comment.authorId === project?.studentId || 
              comment.authorIdentitySnapshot?.toLowerCase().includes('student');
            
            return (
              <div 
                key={comment.id} 
                className={`flex flex-col max-w-[85%] ${
                  isStudent ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-neutral-400">
                  <span className="font-bold text-neutral-500">
                    {getAuthorName(comment)}
                  </span>
                  <span> </span>
                  <span className="italic text-neutral-400 bg-neutral-100 px-1 rounded-sm">
                    {getAuthorIdentity(comment)}
                  </span>
                </div>
                <div 
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isStudent 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-none shadow-3xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{comment.content}</p>
                </div>
                <span className="text-[9px] text-neutral-400 mt-1 px-1">
                  {formatCommentTime(comment)}
                </span>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="border-t border-neutral-100 pt-3.5 bg-white flex gap-2 shrink-0 items-end">
        <textarea
          rows={1}
          placeholder="Type a message to supervisors..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPostingComment}
          className="flex-1 text-xs border border-neutral-200 rounded-xl px-3 py-2.5 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-neutral-50 disabled:text-neutral-400 resize-none max-h-[80px]"
        />
        <button
          type="submit"
          disabled={!commentInput.trim() || isPostingComment}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-200 disabled:hover:bg-neutral-200 text-white disabled:text-neutral-400 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0 mb-0.5"
        >
          {isPostingComment ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}
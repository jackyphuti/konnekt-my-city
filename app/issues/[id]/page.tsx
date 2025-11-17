"use client" // CRITICAL: MUST BE THE VERY FIRST LINE

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client" // Using the client-side import
import { IssueDetail, type Issue } from "@/components/issue-detail"
import { Loader2 } from "lucide-react"

interface IssueDetailsPageProps {
  params: {
    id: string
  }
}

export default function IssueDetailPage({ params }: IssueDetailsPageProps) {
  const supabase = createClient(); // Initialize client here
  const { id } = params;

  // --- State to hold all the fetched data ---
  const [issueData, setIssueData] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [isError, setIsError] = useState(false);


  useEffect(() => {
    const fetchIssueData = async () => {
      setLoading(true);
      
      try {
        // --- 1. Get User and Current User ID ---
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id);

        // --- 2. Fetch Issue Details ---
        // NOTE: All Supabase calls are now client-side (requiring internet)
        const { data: issue, error: issueError } = await supabase
          .from("issues")
          .select(
            `
            *,
            categories(name, icon),
            municipalities(name),
            profiles(full_name, email),
            issue_votes(vote_type),
            issue_updates(
              id,
              update_text,
              is_official,
              created_at,
              profiles(full_name)
            )
          `,
          )
          .eq("id", id)
          .single();

        if (issueError || !issue) {
          console.error("Issue Fetch Error:", issueError);
          setIsError(true);
          return;
        }
        setIssueData(issue as Issue); // Cast to our interface

        // --- 3. Get Vote Counts ---
        const { count: upvCnt } = await supabase
          .from("issue_votes")
          .select("*", { count: "exact", head: true })
          .eq("issue_id", id)
          .eq("vote_type", "upvote");
        setUpvotes(upvCnt || 0);

        const { count: downvCnt } = await supabase
          .from("issue_votes")
          .select("*", { count: "exact", head: true })
          .eq("issue_id", id)
          .eq("vote_type", "downvote");
        setDownvotes(downvCnt || 0);

        // --- 4. Check User Vote ---
        if (user) {
          const { data: vote } = await supabase
            .from("issue_votes")
            .select("vote_type")
            .eq("issue_id", id)
            .eq("user_id", user.id)
            .single();
          setUserVote(vote?.vote_type || null);
        }
      } catch (e) {
        console.error("Critical error during data fetch:", e);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchIssueData();
  }, [id, supabase]); 

  
  // --- Rendering States ---

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="ml-3 text-gray-600">Loading Issue...</p>
      </div>
    );
  }

  // Handle errors or missing issues (custom 404 message)
  if (isError || !issueData) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-red-600">404 - Issue Not Found</h1>
        <p className="text-gray-600 mt-2">The issue with ID: {id} could not be loaded or does not exist.</p>
      </div>
    );
  }

  // --- Final Render ---
  return (
    <IssueDetail
      issue={issueData}
      upvotes={upvotes}
      downvotes={downvotes}
      userVote={userVote}
      currentUserId={currentUserId}
    />
  )
}
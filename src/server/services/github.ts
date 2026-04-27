
import { db } from "@/server/db";

export interface GithubPullRequestFile {
    filename: string;
    sha: string;
    status: "added" | "modified" | "removed" | "renamed" | "copied" | "changed" | "unchanged";
    additions: number;
    deletions: number;
    changes: number;
    patch?: string;
    previous_filename?: string;
}


export interface GithubUser {
    login: string;
    avatar_url: string;

}

export interface GithubPullRequest {
    id: number,
    number: number,
    title: string,
    state: "open" | "closed";
    html_url: string;
    user: GithubUser;
    created_at: string;
    updated_at: string;
    merged_at: string | null;
    draft: boolean;
    head: {
        ref: string;
        sha: string;
    };
    base: {
        ref: string;
    };
    additions: number;
    deletions: number;
    changed_files: number;
}
export interface GithubRepo {
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    html_url: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    updated_at: string;
}

export async function getGitHubAccessToken(userId: string): Promise<string | null> {
    const account = await db.account.findFirst({
        where: {
            userId,
            providerId: 'github',
        },
        select: {
            accessToken: true,
        },
    });

    return account?.accessToken ?? null;
}

export async function fetchGithubRepos(accessToken: string): Promise<GithubRepo[]> {
    const repos: GithubRepo[] = [];
    const perPage = 100;
    let page = 1;

    while (true) {
        const response = await fetch(
            `https://api.github.com/user/repos?per_page=${perPage}&page=${page}&sort=updated`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/vnd.github.v3+json',
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch GitHub repos: ${response.status}`);

        }

        const data = await response.json() as GithubRepo[];
        repos.push(...data);

        if (data.length < perPage) break;
        page++;
    }

    return repos;
}

export async function fetchPullRequests(
    accessToken: string,
    owner: string,
    repo: string,
    state: "open" | "closed" | "all" = "open",

): Promise<GithubPullRequest[]> {
    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/pulls?state=${state}&per_page=30&sort=updated&direction=desc`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Github API Error: ${response.status}`);
    }
    const pulls = (await response.json()) as GithubPullRequest[];


    // The list endpoint omits additions/deletions/changed_files, so fetch
    // each PR individually to populate those fields.
    const detailed = await Promise.all(
        pulls.map((pr) => fetchPullRequest(accessToken, owner, repo, pr.number)),
    );

    return detailed;
}
export async function fetchPullRequest(
    accessToken: string,
    owner: string,
    repo: string,
    prNumber: number,

): Promise<GithubPullRequest> {
    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Github API Error: ${response.status}`);
    }
    return (await response.json()) as GithubPullRequest;
}

export async function fetchPullRequestFiles(
    accessToken: string,
    owner: string,
    repo: string,
    prNumber: number
): Promise<GithubPullRequestFile[]> {
    const files: GithubPullRequestFile[] = [];
    let page = 1;
    const perPage = 100;

    while(true){
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files?per_page=${perPage}&page=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/vnd.github.v3+json',
                }
            }
        );
        if (!response.ok) {
            throw new Error(`Github API Error: ${response.status}`);
        }
        const data = (await response.json()) as GithubPullRequestFile[];
        files.push(...data);
        if(data.length < perPage) break;
        page++;
        
    }
    return files;
}

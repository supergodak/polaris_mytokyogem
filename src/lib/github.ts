import { Octokit } from '@octokit/rest';

// GitHub設定
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'supergodak';
const GITHUB_REPO = process.env.GITHUB_REPO || 'polaris_mytokyogem';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Octokitインスタンスを作成
export function getOctokit() {
  if (!GITHUB_TOKEN) {
    console.error('❌ GITHUB_TOKEN is not set');
    console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('GITHUB')));
    throw new Error('GitHub token is not configured');
  }
  
  console.log('✅ GitHub client initialized');
  console.log('📦 Repository:', `${GITHUB_OWNER}/${GITHUB_REPO}`);
  
  return new Octokit({
    auth: GITHUB_TOKEN,
  });
}

// ファイルの内容を取得
export async function getFileContent(path: string) {
  const octokit = getOctokit();
  
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
    });
    
    if ('content' in data) {
      return {
        content: Buffer.from(data.content, 'base64').toString('utf-8'),
        sha: data.sha,
      };
    }
    
    throw new Error('File content not found');
  } catch (error) {
    console.error('Error fetching file:', error);
    throw error;
  }
}

// ファイルを更新
export async function updateFile(
  path: string,
  content: string,
  message: string,
  sha: string
) {
  const octokit = getOctokit();
  
  try {
    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      sha,
    });
    
    return data;
  } catch (error) {
    console.error('Error updating file:', error);
    throw error;
  }
}

// 画像をアップロード
export async function uploadImage(
  path: string,
  content: Buffer,
  message: string
) {
  const octokit = getOctokit();
  
  try {
    // まず既存ファイルの存在を確認
    let sha: string | undefined;
    try {
      const existing = await octokit.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path,
      });
      
      if ('sha' in existing.data) {
        sha = existing.data.sha;
      }
    } catch {
      // ファイルが存在しない場合は無視
    }
    
    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      message,
      content: content.toString('base64'),
      sha,
    });
    
    return data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// 複数ファイルを一度にコミット（より効率的）
export async function createCommitWithFiles(
  files: Array<{
    path: string;
    content: string | Buffer;
    encoding?: 'utf-8' | 'base64';
  }>,
  message: string
) {
  const octokit = getOctokit();
  
  try {
    // 現在のコミットSHAを取得
    const { data: ref } = await octokit.git.getRef({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      ref: 'heads/main',
    });
    
    const currentCommitSha = ref.object.sha;
    
    // 現在のツリーを取得
    const { data: currentCommit } = await octokit.git.getCommit({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      commit_sha: currentCommitSha,
    });
    
    // 新しいツリーの作成
    const tree = await Promise.all(
      files.map(async (file) => {
        const content = file.encoding === 'base64' 
          ? file.content.toString()
          : Buffer.from(file.content.toString()).toString('base64');
          
        const { data: blob } = await octokit.git.createBlob({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          content,
          encoding: 'base64',
        });
        
        return {
          path: file.path,
          mode: '100644' as const,
          type: 'blob' as const,
          sha: blob.sha,
        };
      })
    );
    
    // 新しいツリーを作成
    const { data: newTree } = await octokit.git.createTree({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      tree,
      base_tree: currentCommit.tree.sha,
    });
    
    // 新しいコミットを作成
    const { data: newCommit } = await octokit.git.createCommit({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      message,
      tree: newTree.sha,
      parents: [currentCommitSha],
    });
    
    // リファレンスを更新
    await octokit.git.updateRef({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      ref: 'heads/main',
      sha: newCommit.sha,
    });
    
    return newCommit;
  } catch (error) {
    console.error('Error creating commit:', error);
    throw error;
  }
}
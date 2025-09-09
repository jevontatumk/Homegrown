import { theme } from '../../constants/theme.js'

export function LearnVideos({ videos, setVideos }) {
  function onFiles(e) {
    const files = Array.from(e.target.files || [])
    const items = files.map((f) => ({
      id: `${f.name}-${Date.now()}`,
      name: f.name,
      url: URL.createObjectURL(f),
      createdAt: new Date().toISOString(),
    }))
    setVideos((prev) => [...items, ...prev])
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-4 border-b border-emerald-200">
          <button
            onClick={() => setVideos([])}
            className={`px-4 py-3 font-medium capitalize ${
              videos.length === 0
                ? "text-emerald-700 border-b-2 border-emerald-500"
                : "text-emerald-600 hover:text-emerald-700"
            }`}
          >
            Clear Videos
          </button>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-8 text-emerald-700/80">No videos yet. Upload some to learn more.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div key={video.id} className="rounded-2xl border border-emerald-200 bg-white p-6">
              <h3 className="font-semibold text-lg mb-2">{video.name}</h3>
              <video src={video.url} controls className="w-full rounded-xl mb-3" />
              <p className="text-sm text-emerald-700/80">
                Uploaded on {new Date(video.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <label className="block">
          <div className="mb-1 text-emerald-800">Upload Videos</div>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={onFiles}
            className={`w-full px-3 py-2 rounded-xl border ${theme.brand.border} ${theme.brand.ring}`}
          />
        </label>
      </div>
    </main>
  )
}

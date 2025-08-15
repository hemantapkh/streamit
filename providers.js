// Streaming providers configuration
const STREAMING_PROVIDERS = {
    vidsrc: {
        name: 'S1',
        movie: (id) => `https://vidsrc.net/embed/movie/${id}`,
        series: (id, season, episode) => `https://vidsrc.net/embed/tv/${id}/${season}/${episode}`,
        referrerPolicy: 'no-referrer'
    },
    multiembed: {
        name: 'S2',
        movie: (id) => `https://multiembed.mov/directstream.php?video_id=${id}`,
        series: (id, season, episode) => `https://multiembed.mov/directstream.php?video_id=${id}&s=${season}&e=${episode}`,
        referrerPolicy: 'no-referrer'
    },
    embed2: {
        name: 'S3',
        movie: (id) => `https://www.2embed.cc/embed/${id}`,
        series: (id, season, episode) => `https://www.2embed.cc/embed/tv/${id}/${season}/${episode}`,
        referrerPolicy: null
    },
    embedsu: {
        name: 'S4',
        movie: (id) => `https://embed.su/embed/movie/${id}`,
        series: (id, season, episode) => `https://embed.su/embed/tv/${id}/${season}/${episode}`,
        referrerPolicy: 'no-referrer'
    },
    autoembed: {
        name: 'S5',
        movie: (id) => `https://player.autoembed.cc/embed/movie/${id}`,
        series: (id, season, episode) => `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`,
        referrerPolicy: 'no-referrer'
    },
    soap2day: {
        name: 'S6',
        movie: (id) => `https://soap2dayto.win/embed/movie/${id}`,
        series: (id, season, episode) => `https://soap2dayto.win/embed/tv/${id}/${season}/${episode}`,
        referrerPolicy: 'no-referrer'
    },
    vidsrccc: {
        name: 'S7',
        movie: (id) => `https://vidsrc.cc/v2/embed/movie/${id}`,
        series: (id, season, episode) => `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}`,
        referrerPolicy: 'no-referrer'
    },
    vidlink: {
        name: 'S8',
        movie: (id) => `https://vidlink.pro/movie/${id}`,
        series: (id, season, episode) => `https://vidlink.pro/embed/tv/${id}/${season}/${episode}`,
        referrerPolicy: 'no-referrer'
    },
    vidfast: {
        name: 'S9',
        movie: (id) => `https://vidfast.pro/movie/${id}`,
        series: (id, season, episode) => `https://vidfast.pro/embed/tv/${id}/${season}/${episode}`,
        referrerPolicy: 'no-referrer'
  },
    videasy: {
        name: 'S10',
        movie: (id) => `https://player.videasy.net/movie/${id}`,
        series: (id, season, episode) => `https://player.videasy.net/tv/${id}/${season}/${episode}`,
        referrerPolicy: 'no-referrer'
    },
};

/**
 * Generates the embed URL for a given provider, type, and ID.
 */
function generateEmbedUrl(provider, type, id, season, episode) {
    if (STREAMING_PROVIDERS[provider] && STREAMING_PROVIDERS[provider][type]) {
        return STREAMING_PROVIDERS[provider][type](id, season, episode);
    }
    return null;
}

// Streaming providers configuration
const STREAMING_PROVIDERS = {
    vidsrc: {
        name: 'Vidsrc',
        movie: (id) => `https://vidsrc.net/embed/movie/${id}`,
        series: (id, season, episode) => `https://vidsrc.net/embed/tv/${id}/${season}/${episode}`,
        referrerPolicy: 'no-referrer'
    },
    multiembed: {
        name: 'Multiembed',
        movie: (id) => `https://multiembed.mov/directstream.php?video_id=${id}`,
        series: (id, season, episode) => `https://multiembed.mov/directstream.php?video_id=${id}&s=${season}&e=${episode}`,
        referrerPolicy: 'no-referrer'
    },
    embed2: {
        name: '2embed',
        movie: (id) => `https://www.2embed.cc/embed/${id}`,
        series: (id, season, episode) => `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`,
        referrerPolicy: null
    },
    embedsu: {
        name: 'Embed.su',
        movie: (id) => `https://embed.su/embed/movie/${id}`,
        series: (id, season, episode) => `https://embed.su/embed/tv/${id}/${season}/${episode}`,
        referrerPolicy: 'no-referrer'
    },
    autoembed: {
        name: 'Autoembed',
        movie: (id) => `https://player.autoembed.cc/embed/movie/${id}`,
        series: (id, season, episode) => `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`,
        referrerPolicy: 'no-referrer'
    },
    soap2day: {
        name: 'Soap2day',
        movie: (id) => `https://soap2dayto.win/embed/movie/${id}`,
        series: (id, season, episode) => `https://soap2dayto.win/embed/tv/${id}/${season}/${episode}`,
        referrerPolicy: 'no-referrer'
    },
    vidsrccc: {
        name: 'Vidsrc.cc',
        movie: (id) => `https://vidsrc.cc/v2/embed/movie/${id}`,
        series: (id, season, episode) => `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}`,
        referrerPolicy: 'no-referrer'
    },
    vidlink: {
        name: 'Vidlink',
        movie: (id) => `https://vidlink.pro/movie/${id}`,
        series: (id, season, episode) => `https://vidlink.pro/tv/${id}/${season}/${episode}`,
        referrerPolicy: 'no-referrer'
    },
    vidfast: {
        name: 'Vidfast',
        movie: (id) => `https://vidfast.pro/movie/${id}`,
        series: (id, season, episode) => `https://vidfast.pro/tv/${id}/${season}/${episode}`,
        referrerPolicy: 'no-referrer'
  },
    videasy: {
        name: 'Videasy',
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

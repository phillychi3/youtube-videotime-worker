export function toJSON(data, status = 200) {
  let body = JSON.stringify(data, null, 2);
  let headers = { "content-type": "application/json" };
  return new Response(body, { headers, status });
}

export function toError(error, status = 400) {
  return toJSON({ error }, status);
}

export function reply(output) {
  if (output != null) return toJSON(output, 200);
  return toError("Error with query", 500);
}

export function isValidYoutubeUrl(url) {
  const regex = /^((?:https?:)\/\/)((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
  return regex.test(url)
}

export function formatDuration(seconds) {
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds % 3600) / 60);
  var secs = Math.floor(seconds % 60);

  var parts = [];
  if (hours > 0) {
      parts.push(hours + '小時');
  }
  if (minutes > 0 || hours > 0) {
      parts.push(minutes + '分');
  }
  parts.push(secs + '秒');

  return parts.join(' ');
}
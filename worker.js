addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

async function handle(request) {
  // extract the target url from ?url=
  const { searchParams } = new URL(request.url)
  const target = searchParams.get('url')
  if (!target) {
    return new Response('🚨 Missing “url” parameter', { status: 400 })
  }


  let origin
  try {
    origin = new URL(target)
  } catch {
    return new Response('🚨 Invalid URL', { status: 400 })
  }

  
  const resp = await fetch(target, {
    headers: { },
    redirect: 'manual'
  })

  const newHeaders = new Headers(resp.headers)
  newHeaders.set('Access-Control-Allow-Origin', '*')
  newHeaders.set('Access-Control-Allow-Methods','GET,HEAD,OPTIONS')
  newHeaders.set('Access-Control-Allow-Headers','*')

  return new Response(resp.body, {
    status: resp.status,
    statusText: resp.statusText,
    headers: newHeaders
  })
}

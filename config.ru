use Rack::Static,
  :urls => ["/assets", "/css", "/data", "/favicons", "/i18n", "/images", "/map", "/templates"],
  :root => "client"

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html',
      'Cache-Control' => 'public, max-age=86400'
    },
    File.open('client/index.html', File::RDONLY)
  ]
}

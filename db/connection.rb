ActiveSupport.on_load(:active_record) do
  db = URI.parse(ENV['DATABASE_URL'] || 'postgres:///localhost/hexagonlab')
  pool = ENV["DB_POOL"] || ENV['MAX_THREADS'] || 5

  ActiveRecord::Base.establish_connection(
    :adapter  => db.scheme == 'postgres' ? 'postgresql' : db.scheme,
    :host     => db.host,
    :username => db.user,
    :password => db.password,
    :database => db.path[1..-1],
    :encoding => 'utf8',
    :pool     => pool
  )
end

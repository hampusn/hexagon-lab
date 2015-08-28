workers Integer(ENV['WEB_CONCURRENCY'] || 2)
threads_count = Integer(ENV['MAX_THREADS'] || 5)
threads threads_count, threads_count

preload_app!

rackup      DefaultRackup
port        ENV['PORT']     || 5000
environment ENV['RACK_ENV'] || 'development'

on_worker_boot do
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
end
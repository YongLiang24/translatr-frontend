require 'rubygems'
require 'sinatra'

class MyApp < Sinatra::Base
  get '/' do
    File.read(File.join('index.html'))
  end
end

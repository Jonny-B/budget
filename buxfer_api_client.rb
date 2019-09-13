require 'json'
require 'net/http'
require 'net/https'
require 'uri'

# XXX WARNING: only a sample; please do NOT hard-code your username 
# or passwords in this manner in your API clients

username = "username"
password = "password"

#############

def getResponse(url)

    http = Net::HTTP.new("www.buxfer.com", 443)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    resp, data = http.get("/api/#{url}", nil)

    result = JSON.parse(data)
    response = result['response']
    if response['status'] != "OK"
        puts "Error: #{response['status'].gsub(/ERROR: /, '')}"
        exit 1;
    end

    return response
end

response = getResponse("login?userid=#{username}&password=#{password}");
token = response['token']

response = getResponse("transactions?token=#{token}")

response['transactions'].each { |transaction| 
    puts sprintf("%40s %8s %10.2f \n", transaction['description'], transaction['date'], transaction['amount']);
}
exit 0;


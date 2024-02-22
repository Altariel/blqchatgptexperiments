export OPENAI_API_KEY=""

curl --request POST \
  --url https://api.openai.com/v1/audio/transcriptions \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header 'Content-Type: multipart/form-data' \
  --form file=@/Users/michele/Downloads/esempio.m4a \
  --form model=whisper-1
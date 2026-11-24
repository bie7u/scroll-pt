import json, os, sys, time
from gtts import gTTS
items = json.load(open(sys.argv[1])); out = sys.argv[2]; os.makedirs(out, exist_ok=True)
done = fail = 0
for it in items:
    f = os.path.join(out, it['key'] + '.mp3')
    if os.path.exists(f) and os.path.getsize(f) > 500: done += 1; continue
    for a in range(6):
        try:
            gTTS(it['text'], lang='pt', tld='pt').save(f)      # portugalski z Portugalii
            done += 1; time.sleep(0.4); break
        except Exception as e:
            time.sleep(3 + 3 * a)
    else:
        fail += 1; print('FAIL', it['text'], flush=True)
print('done', done, 'fail', fail)

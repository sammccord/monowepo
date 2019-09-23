import { add } from '@sammccord/monowepo.packages.common'
import * as polka from 'polka'

polka()
  .get('/', (req, res) => {
    res.end(`${add(2, 3)}`)
  })
  .listen(3000, err => {
    if (err) throw err
    console.log(` > Running on localhost: 3000`)
  })

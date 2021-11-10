const run = async () => {
  // 3 weeks ago (+1 day because the current day has no data)
  const threeWeeksAgo = new Date()
  threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 22)
  // yyyy-mm-dd format
  const threeWeeksAgoFormatted = threeWeeksAgo.toISOString().split('T')[0]

  const url = `https://services5.arcgis.com/ROBnTHSNjoZ2Wm1P/arcgis/rest/services/COVID_19_Statistics/FeatureServer/7/query?where=dtcreate>=DATE'${threeWeeksAgoFormatted}'&outFields=dtcreate,Alameda_County&outSR=4326&f=json`
  const res = await fetch(url)
  const data = await res.json()
  const { features } = data

  // sum cases for each 7 days
  const cases = features.reduce((acc, { attributes: { Alameda_County } }, idx) => {
    const week = Math.floor(idx / 7).toString()
    if (!acc[week])
      acc[week] = 0
    acc[week] += Alameda_County
    return acc
  }, {})

  console.log(cases)
}

window.addEventListener('load', run)

const fetchFromBuilder = async () => {
  return [
    {
      type: 'text',
      style: {
        padding: '5px',
        margin: '5px'
      },
      children: [{ text: 'ct_uid.title'}]
    },
    {
      type: 'text',
      style: {
        padding: '5px',
        margin: '5px'
      },
      children: [{ text: 'ct_uid.subtitle'}]
    }
  ]
}

const fetchFromCMS = async () => {
  return ({
    ct_uid: {
      title: 'Hello world',
      subtitle: 'This is beautiful to edit this way.'
    },
  })
}

class weeb {
  static init(stack: any) {

  }

  static async fetch(ct_uid: string, options: {
    page_url: string 
  }) {
    // Parallely fetching structure and ui data
    const promises = [fetchFromBuilder(), fetchFromCMS()];
    const uiData = await Promise.all(promises);
    return uiData;
  }
}

export default weeb;
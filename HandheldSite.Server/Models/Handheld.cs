using System;

namespace HandheldSite.Server.Models
{
    public class Handheld
    {

        public int HandheldId {get;set;}
        public string HandheldName {get;set;}  = string.Empty;
        public string HandheldImg {get;set;} = string.Empty;
    }
}
